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
  {
    id: "002",
    name: "Noppera-bo",
    nameJa: "のっぺらぼう",
    category: "humanoid",
    categoryLabel: "Humanoid",
    risk: "beta",
    riskLabel: "Beta risk",
    status: "Observed",
    image: [
      "assets/archive/002_1.png",
      "assets/archive/002_2.png"
    ],
    instagram: "",
    location: "Tokyo, JP",
    recorded: "2004.09.03",
    summary: "東京都内の住宅街で記録された、顔面構造をほとんど持たない人間擬態型の人型生命体。",
    summaryEn: "A human-mimicking humanoid life form with almost no visible facial structure, recorded in a residential area of Tokyo, Japan.",
    description: "対象は深夜の住宅街において、約6分間にわたり同一地点に直立した状態で確認された。服装や体格は一般的な成人とほぼ一致していたが、顔面には眼球、鼻孔、耳などの明確な感覚器官が確認できず、滑らかな皮膚状組織のみが存在していた。日本には古くから、一見すると普通の人間でありながら、振り返った瞬間に顔から目・鼻・口が消失している「のっぺらぼう」と呼ばれる存在の目撃談が残されている。興味深いことに、多くの伝承では対象が人間を積極的に襲うことはなく、接触者の反応を観察するような行動を取った後、その場から姿を消している。これらの特徴から、のっぺらぼうは妖怪ではなく、人間社会への潜入や観察を目的として人体を模倣する未知の知的生命体である可能性が考えられる。衣服や体格、歩行動作までは高精度に再現できる一方、複雑な顔面構造の再現には失敗していたとすれば、古来の目撃談とも一致する。現在では擬態能力がさらに向上し、外見だけで人間と区別することは困難になっている可能性も否定できない。",
    descriptionEn: "The subject was observed standing motionless at the same location in a residential district late at night for approximately six minutes. Its clothing and body proportions were almost indistinguishable from those of an ordinary adult human. However, no clearly identifiable eyes, nostrils, ears, or other sensory organs could be confirmed on the face, which appeared to consist only of smooth skin-like tissue. For centuries, Japanese folklore has described entities known as noppera-bo: figures that initially appear completely human, only to reveal a face without eyes, a nose, or a mouth when approached. Interestingly, many of these accounts do not describe direct attacks. Instead, the entities often appear to observe the reactions of witnesses before disappearing. This behavior raises the possibility that the noppera-bo was not a supernatural yokai, but an unknown intelligent life form capable of imitating the human body for the purpose of observation or infiltration. If such beings were able to reproduce human clothing, proportions, and movement while failing to accurately reconstruct the complex anatomy of the face, many traditional accounts become surprisingly consistent. It is also possible that their mimicry has improved over time, making modern individuals considerably more difficult to distinguish from ordinary humans.",
    traits: ["人間擬態", "顔面欠損", "行動観察"]
  },
];
