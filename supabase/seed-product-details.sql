-- Batch 5: rerunnable, PDF-derived product detail enrichment.
-- Values below are transcribed only where legible in Woodbay (1).pdf.
update public.products set product_code = 'OEM-IM4506L', description = 'Glass Pantry With Bidding.', seo_title = 'Glass Pantry | Woodbay Kitchen Accessories' where slug = 'glass-pantry';
update public.products set product_code = 'OEM-GLB-BM20', description = 'Glass BPO With Bidding (Base Mounted).' where slug = 'bottle-pullout';
update public.products set product_code = 'OEM-CW212, CW213', description = 'S Corner White.' where slug = 'corner-basket';
update public.products set product_code = 'OEM-SR-6001', description = 'Wardrobe trouser rack.' where slug = 'wardrobe-trouser-rack';
update public.products set description = 'Smart furniture solutions designed for modern living.' where slug = 'smart-furniture';
update public.products set description = 'Smart Waterfall Kitchen Sink crafted from premium 304 stainless steel.', seo_title = 'Waterfall Sink | Woodbay Smart Products' where slug = 'waterfall-sink';

insert into public.product_variants (product_id, name, sku, dimension, finish, metadata, sort_order)
select p.id, v.name, v.sku, v.dimension, v.finish, v.metadata::jsonb, v.sort_order
from (values
('glass-pantry','450mm x 6 Layer','OEM-IM4506L','450mm x 6 Layer','Premium','{}',10),
('glass-pantry','600mm x 6 Layer','OEM-IM6006L','600mm x 6 Layer','Premium','{}',20),
('bottle-pullout','200mm','OEM-GLB-BM20','200mm',null,'{}',10),
('bottle-pullout','250mm','OEM-GLB-BM25','250mm',null,'{}',20),
('corner-basket','900mm L/R Option','OEM-CW212, CW213','900mm L/R Option',null,'{"colour":"White"}',10),
('wardrobe-trouser-rack','600mm','OEM-SR-6001','600mm',null,'{}',10),
('wardrobe-trouser-rack','900mm','OEM-SR-9001','900mm',null,'{}',20),
('smart-furniture','Smart WiFi Side Table',null,null,null,'{"features":["Wireless Charging","Bluetooth Speaker (Built-in)","USB Charging Port","3 Spacious Drawers","Premium Finish"]}',10),
('waterfall-sink','Piano Waterfall Sink',null,'750 x 460mm',null,'{"material":"SUS 304 stainless steel","bowl_depth":"230mm","bowl_thickness":"3.0mm","features":["Smart Control Panel","LED Digital Display","Waterfall Flow","High Pressure Rinse","Soap Dispenser","Cup Washer","Pull-Down Faucet"]}',10),
('waterfall-sink','Classic Waterfall Sink',null,'750 x 460mm',null,'{"material":"SUS 304 stainless steel","features":["Smooth Waterfall Flow","Pull-Down Faucet","Soap Dispenser"]}',20)
) as v(product_slug,name,sku,dimension,finish,metadata,sort_order)
join public.products p on p.slug = v.product_slug
where not exists (select 1 from public.product_variants existing where existing.product_id = p.id and existing.name = v.name);
