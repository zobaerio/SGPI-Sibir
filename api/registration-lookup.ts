import { supabaseRequest, toStudent } from './_lib/supabase';
type Req={method?:string;headers:Record<string,string|string[]|undefined>;body?:any};
type Res={setHeader(n:string,v:string):void;status(c:number):Res;json(d:unknown):void};
const attempts=new Map<string,{count:number;reset:number}>();
export default async function handler(req:Req,res:Res){
 res.setHeader('Cache-Control','no-store, max-age=0');
 if(req.method!=='POST') return res.status(405).json({message:'Method not allowed'});
 const ip=String(req.headers['x-forwarded-for']||'unknown').split(',')[0];
 const now=Date.now(), a=attempts.get(ip);
 if(a&&a.reset>now&&a.count>=10) return res.status(429).json({message:'অনেকবার চেষ্টা হয়েছে। পরে আবার চেষ্টা করুন।'});
 attempts.set(ip,!a||a.reset<=now?{count:1,reset:now+900000}:{...a,count:a.count+1});
 const id=String(req.body?.id||'').trim().toUpperCase();
 const mobile=String(req.body?.mobile||'').replace(/\D/g,'').replace(/^880/,'0');
 if(!/^SGPI-2026-\d+$/.test(id)||!/^01[3-9]\d{8}$/.test(mobile)) return res.status(400).json({message:'রেজিস্ট্রেশন আইডি ও সঠিক মোবাইল নম্বর দিন।'});
 try{
  const rows=await supabaseRequest('sgpi_registrations?select=*&id=eq.'+encodeURIComponent(id)+'&mobile=eq.'+encodeURIComponent(mobile)+'&limit=1');
  if(!rows.length) return res.status(404).json({message:'তথ্য মেলেনি। আইডি ও মোবাইল নম্বর যাচাই করুন।'});
  return res.status(200).json({registration:toStudent(rows[0])});
 }catch(e:any){console.error('Registration lookup failed:',e);return res.status(500).json({message:'এখন তথ্য যাচাই করা যাচ্ছে না।'});}
}