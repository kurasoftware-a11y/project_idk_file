/**
 * IDK FILE archive dataset
 *
 * 画像配置： assets/archive/
 * 新規追加時、下の配列へ同じ形式のオブジェクトを追加する。
 * image は文字列または配列で指定可能。複数指定した場合は自動で切り替わる。
 * summaryEn / descriptionEn / instagram は任意。値がある項目だけ表示される。
 * 一覧・検索・分類フィルター・ページ番号・詳細画面は自動更新。
 */
window.IDK_ARCHIVE_SETTINGS = {
  itemsPerPage: 6,
  imageInterval: 5000
};

window.IDK_ARCHIVE = [
  {
    id: "001",
    name: "Kappa",
    nameJa: "河童",
    category: "amphibious",
    categoryLabel: "Amphibious",
    risk: "gamma",
    riskLabel: "Gamma risk",
    status: "Observed",
    image: [
      "assets/archive/001_1.png",
      "assets/archive/001_2.png"
    ],
    instagram: "",
    location: "Tono, Iwate, JP",
    recorded: "2001.06.18",
    summary: "岩手県遠野市の河川監視映像に記録された小型の両生型人型生命体。",
    summaryEn: "A small amphibious humanoid life form captured on river surveillance footage in Tono City, Iwate Prefecture, Japan.",
    description: "対象は水中で約47分間にわたり呼吸動作を示さず、その後二足歩行で浅瀬へ移動した。日本各地の川や沼には、古くから奇妙な生き物の目撃談が残されている。一般には、子供ほどの大きさの身体、緑や灰色がかった皮膚、水かきのある手足、背中の甲羅、そして頭頂部にある皿のようなくぼみを持つ姿で知られている。しかし興味深いことに、河童の姿や性質は地域によって大きく異なる。「想像上の妖怪」として片付けるよりも、かつて日本の水辺に潜伏していた未知の知的生命体、あるいは地球環境へ適応した地球外生命体の一種だったと考えたほうが、数多くの奇妙な逸話を説明できる部分も多い。",
    descriptionEn: "The subject showed no signs of respiratory activity while submerged for approximately 47 minutes, after which it moved into the shallows on two legs.For centuries, strange creatures have been reported in rivers and marshes throughout Japan. They are commonly described as being roughly the size of a child, with greenish or grayish skin, webbed hands and feet, a shell-like structure on the back, and a dish-shaped depression on the top of the head.Interestingly, however, descriptions of the kappa’s appearance and behavior vary considerably from region to region. Rather than dismissing them simply as “imaginary yokai,” many of these unusual accounts may be more plausibly explained by considering the possibility that they were an unknown intelligent species once hiding in Japan’s waterways—or perhaps even a form of extraterrestrial life that had adapted to Earth’s environment.",
    traits: ["頭頂水盆", "水中呼吸", "環境擬態"]
  },
];
