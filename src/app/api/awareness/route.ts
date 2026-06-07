import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const postSchema = z.object({
  title_en: z.string().min(2),
  title_am: z.string().optional(),
  title_ti: z.string().optional(),
  title_om: z.string().optional(),
  body_en: z.string().min(10),
  body_am: z.string().optional(),
  body_ti: z.string().optional(),
  body_om: z.string().optional(),
  category: z.string().min(1),
});

const DUMMY_POSTS = [
  {
    id: 'dummy-1',
    category: 'Mental Health',
    title_en: 'Understanding Anxiety: Signs, Symptoms & Coping Strategies',
    title_am: 'ጭንቀትን መረዳት፡ ምልክቶች እና አቋቋሚ ዘዴዎች',
    body_en: 'Anxiety is one of the most common mental health conditions worldwide, yet it remains widely misunderstood. It can manifest as persistent worry, racing thoughts, or physical symptoms like a fast heartbeat. The good news is that anxiety is highly treatable through therapy, mindfulness, and lifestyle changes. Learning to recognize your triggers is the first powerful step toward recovery.',
    body_am: 'ጭንቀት በዓለም ላይ ካሉ በጣም የተለመዱ የአእምሮ ጤና ችግሮች አንዱ ነው። ቀጣይ ሥጋት፣ ፈጣን ሀሳቦች ወይም ፈጣን ልብ ምት ያሉ አካላዊ ምልክቶች ሊታዩ ይችላሉ። ቴራፒ፣ ትኩረት እና የአኗኗር ዘይቤ ለውጦች አማካይነት ሊታከም ይችላል።',
    image: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&q=80',
    published_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'dummy-2',
    category: 'Nutrition',
    title_en: 'Injera & Iron: How Ethiopian Cuisine Supports Your Health',
    title_am: 'እንጀራ እና ብረት፡ የኢትዮጵያ ምግብ ጤናዎን እንዴት ይደግፋል',
    body_en: 'Injera, Ethiopia\'s iconic sourdough flatbread made from teff, is a nutritional powerhouse. Rich in iron, calcium, and resistant starch, teff supports gut health and stable blood sugar. Paired with lentils (misir) and leafy greens (gomen), a traditional Ethiopian meal can meet nearly all your daily micronutrient needs without supplements.',
    body_am: 'ከጤፍ የተሠራ እንጀራ ብረት፣ ካልሲየም እና ጥቅም ሰጪ ስታርች የሚሰጥ ትልቅ ምንጭ ነው። ምስርና ጎመን ጋር ሲቀርብ፣ ሙሉ ዕለታዊ ማዕድናትዎን ያሟላል።',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
    published_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'dummy-3',
    category: 'Maternal',
    title_en: 'Safe Motherhood: What Every Pregnant Woman Should Know',
    title_am: 'ደህንነቱ የተጠበቀ እናትነት፡ እያንዳንዱ እናት ማወቅ ያለባቸው',
    body_en: 'Antenatal care (ANC) visits are critical for a healthy pregnancy. WHO recommends at least 8 contacts with a healthcare provider during pregnancy. These visits monitor fetal growth, screen for complications like preeclampsia, and ensure timely vaccinations. In Ethiopia, accessing ANC at health centers is free — take advantage of this vital service.',
    body_am: 'ቅድመ ወሊድ ክትትል ለጤናማ እርግዝና ወሳኝ ነው። ዓለም ጤና ድርጅት ቢያንስ 8 ጊዜ የጤና ባለሙያ ጋር መደረስ ይመክራል። ኢትዮጵያ ውስጥ ቅድመ ወሊድ ክትትል በጤና ጣቢያዎች ነፃ ነው።',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80',
    published_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'dummy-4',
    category: 'Malaria',
    title_en: 'Malaria Prevention: Sleep Safe, Stay Protected',
    title_am: 'ወባ መከላከል፡ ያለ ስጋት ተኛ፣ ጠብቅ',
    body_en: 'Malaria remains a significant health threat in Ethiopia\'s lowland regions. The most effective prevention tools are insecticide-treated bed nets (ITNs) and indoor residual spraying (IRS). Seek medical attention immediately if you develop fever and chills after traveling to endemic areas. Early diagnosis with a rapid test and prompt artemisinin treatment is life-saving.',
    body_am: 'ወባ በኢትዮጵያ ቆላማ አካባቢዎች ጠቃሚ የጤና ስጋት ሆኖ ቀጥሏል። ፀረ ነፍሳት ወጋ ያለው አጎበር መጠቀም በጣም ውጤታማ የመከላከያ ዘዴ ነው።',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
    published_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'dummy-5',
    category: 'Hygiene',
    title_en: 'Hand Hygiene: The Single Most Effective Disease Prevention',
    title_am: 'የእጅ ንጽሕና፡ በጣም ውጤታማ የበሽታ መከላከያ',
    body_en: 'Proper handwashing with soap can reduce diarrheal disease risk by up to 50% and respiratory infections by 21%. The five critical moments are: before eating, after using the toilet, after handling animals, after coughing or sneezing, and before preparing food. A minimum of 20 seconds scrubbing all surfaces of both hands is required to be effective.',
    body_am: 'በሳሙና የእጅ መታጠብ የተቅማጥ በሽታ አደጋን እስከ 50% ሊቀንስ ይችላል። አምስቱ ወሳኝ ጊዜዎች፡ ከምግብ በፊት፣ መጸዳጃ ቤት ከጠቀሙ በኋላ፣ እንስሳት ከዳሰሱ በኋላ፣ ካስነጠሱ/ሳሉ በኋላ፣ ምግብ ከማዘጋጀት በፊት ናቸው።',
    image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&q=80',
    published_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'dummy-6',
    category: 'Mental Health',
    title_en: 'Breaking the Stigma: Talking About Depression in Ethiopia',
    title_am: 'ስቃይን ማቃለል፡ ስለ ድብርት ማውራት',
    body_en: 'Depression affects over 5 million people in Ethiopia, yet cultural stigma prevents many from seeking help. Common misconceptions — that depression is a sign of weakness or spiritual failure — delay treatment by an average of 10 years. Community-based conversations, using local language, and involving religious leaders have proven effective in breaking these barriers.',
    body_am: 'ድብርት ከ5 ሚሊዮን በላይ ኢትዮጵያውያንን ይነካቸዋል። ነገር ግን የማህበረሰብ ስቃይ ብዙዎችን እርዳታ ከመፈለግ ያግዳቸዋል። የማህበረሰብ ውይይቶችና ሃይማኖት መሪዎችን ማሳተፍ እነዚህን እንቅፋቶች ለማቃለል ውጤታማ ነው።',
    image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80',
    published_at: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'dummy-7',
    category: 'HIV/AIDS',
    title_en: 'HIV & U=U: Why Undetectable Means Untransmittable',
    title_am: 'ኤች አይ ቪ እና U=U፡ ሊታወቅ የማይችል ማለት ሊተላለፍ የማይችል ማለት ነው',
    body_en: 'People living with HIV who are on treatment and have an undetectable viral load cannot sexually transmit the virus to partners — this is the U=U (Undetectable = Untransmittable) principle, endorsed by all major health organizations. Consistent ART (antiretroviral therapy) not only protects partners but allows people with HIV to live long, healthy lives.',
    body_am: 'ኤች አይ ቪ ያለባቸው እና ሊታወቅ የማይችል የቫይረስ ጭነት ያላቸው ሰዎች ቫይረሱን ለጓደኞቻቸው ሊያስተላልፉ አይችሉም። ቀጣይ ኤአርቲ ሕክምና ሕይወትን ያራዝማል።',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80',
    published_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const lang = searchParams.get('lang') || 'en';
  const category = searchParams.get('category');
  const limit = 10;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('awareness_posts')
    .select('*')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) query = query.eq('category', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fall back to dummy data if DB is empty
  let posts = data || [];
  if (posts.length === 0 && page === 1) {
    posts = category
      ? DUMMY_POSTS.filter(p => p.category === category) as any
      : DUMMY_POSTS as any;
  }

  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const role = req.headers.get('x-user-role');
  const userId = req.headers.get('x-user-id');

  if (role !== 'agent' || !userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

  const { data, error } = await supabase
    .from('awareness_posts')
    .insert({ ...parsed.data, author_id: userId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data }, { status: 201 });
}
