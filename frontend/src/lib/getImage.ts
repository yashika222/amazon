export const getRealisticImage = (title: string, defaultImage: string): string => {
  const t = title.toLowerCase();
  
  if (t.includes("headphones") || t.includes("noise cancelling")) return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400";
  if (t.includes("tv") || t.includes("television")) return "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400";
  if (t.includes("smartphone") || t.includes("phone")) return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400";
  if (t.includes("laptop") || t.includes("computer")) return "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400";
  
  if (t.includes("t-shirt") || t.includes("shirt") || t.includes("tee")) return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400";
  if (t.includes("jacket") || t.includes("denim")) return "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400";
  if (t.includes("shoes") || t.includes("sneakers") || t.includes("running")) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400";
  if (t.includes("wallet") || t.includes("leather")) return "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400";

  if (t.includes("cookware") || t.includes("pan") || t.includes("pot")) return "https://images.unsplash.com/photo-1584990347449-cdab6bb2720d?w=400";
  if (t.includes("vacuum") || t.includes("robot")) return "https://images.unsplash.com/photo-1589715974052-a6f95f4be642?w=400";
  if (t.includes("pillow") || t.includes("foam")) return "https://images.unsplash.com/photo-1580826978137-fc21183ffb5f?w=400";
  if (t.includes("towels") || t.includes("bath")) return "https://images.unsplash.com/photo-1620229828551-7af4dbb86307?w=400";

  if (t.includes("programmer") || t.includes("code") || t.includes("patterns") || t.includes("habits") || t.includes("book")) return "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400";

  if (t.includes("blocks") || t.includes("lego") || t.includes("toy")) return "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400";
  if (t.includes("rc car") || t.includes("car")) return "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400";
  if (t.includes("bear") || t.includes("plush")) return "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400";
  if (t.includes("board game") || t.includes("game")) return "https://images.unsplash.com/photo-1610890716171-ec5af7ccb0e6?w=400";

  return defaultImage;
};
