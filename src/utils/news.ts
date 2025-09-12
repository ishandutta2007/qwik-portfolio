import type { New } from "~/types";
import { getDb } from "~/utils/firebase";
import { ref, get, onValue } from "firebase/database";

const load = async () => {
  const db = await getDb();
  const news = ref(db, "news");
  const res = (await get(news)).val() as any;
  _news = res
    ? Object.keys(res)?.map((key: string) => {
        return { ...res[key], id: key } as New;
      })
    : [];

  onValue(news, (snapshot) => {
    const res = snapshot.val();
    _news = res
      ? Object.keys(res)?.map((key: string) => {
          return { ...res[key], id: key } as New;
        })
      : [];
  });

  return _news;
};

let _news: New[];

export const fetchNews = async (): Promise<New[]> => {
  _news = _news || load();

  return await _news;
};

export const findNewBySlug = async (slug: string): Promise<New | null> => {
  if (!slug) return null;

  return _news?.find((item) => item.slug === slug) as New;
};
