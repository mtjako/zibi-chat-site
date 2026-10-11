const now=Date.now(),hour=3600000;
const tokens={input_tokens:18420,output_tokens:8320,cache_creation_tokens:12000,cache_creation_5m_tokens:12000,cache_creation_1h_tokens:0,cache_read_tokens:86040,reasoning_tokens:2100,total_tokens:124780};
export async function invoke(cmd:string) {
 if(cmd==='get_claude_oauth_usage') return {limits:[{kind:'session',group:'session',percent:32,resets_at:new Date(now+3.4*hour).toISOString(),model_display_name:null,is_active:true},{kind:'weekly_all',group:'weekly',percent:18,resets_at:new Date(now+96*hour).toISOString(),model_display_name:null,is_active:true}],fetched_at_utc:new Date(now).toISOString()};
 if(cmd==='get_claude_service_status') return {indicator:'none',description:'All Systems Operational',components:[],incidents:[],page_updated_at:null,fetched_at_utc:new Date(now).toISOString()};
 if(cmd==='get_claude_current_billing_block') return {start_timestamp:new Date(now-1.6*hour).toISOString(),end_timestamp:new Date(now+3.4*hour).toISOString(),first_activity:new Date(now-hour).toISOString(),last_activity:new Date(now).toISOString(),is_active:true,message_count:42,tokens,per_model:[{model:'claude-sonnet-4-5',message_count:42,tokens,cost:{total:2.34,incomplete:false}}],cost:{total:2.34,incomplete:false}};
 if(cmd==='get_claude_oauth_profile') return {has_claude_max:true,has_claude_pro:false,rate_limit_tier:'default_claude_max_5x',organization_type:null};
 return null;
}
