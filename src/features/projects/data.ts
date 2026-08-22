import { createClient } from "@/lib/supabase/server";
export type Project={id:string;title:string;slug:string;category:string;location:string|null;description:string|null;featured_image:string|null;project_images:{id:string;storage_key:string;alt_text:string|null;sort_order:number}[]};
const publicProjectSelect="id,title,slug,category,location,description,featured_image,project_images(id,storage_key,alt_text,sort_order)";
export async function getPublishedProjects(){const{data,error}=await (await createClient()).from("projects").select(publicProjectSelect).eq("status","published").order("sort_order").order("created_at",{ascending:false});if(error)throw error;return(data??[])as Project[]}
export async function getPublishedProject(slug:string){const{data,error}=await (await createClient()).from("projects").select(publicProjectSelect).eq("slug",slug).eq("status","published").maybeSingle();if(error)throw error;return data as Project|null}
