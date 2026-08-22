/**
 * IDK FILE archive dataset
 *
 * 画像配置： assets/archive/
 * 新規追加時、下の配列へ同じ形式のオブジェクトを追加する。
 * slug は個別ページのURLに使用する。追加・編集後は node scripts/generate-record-pages.mjs を実行する。
 * image は文字列または配列で指定可能。複数指定した場合は自動で切り替わる。
 * imagePosition は詳細画像の縦位置。"top" = 上端、"center" = 中央、"bottom" = 下端。省略時は "center"。
 * 画像ごとに変える場合は、image と同じ順番で imagePosition: ["top", "bottom"] のように指定できる。
 * thumbnailPosition で一覧画像の縦位置を上書きできる。省略時は imagePosition と同じ位置を使用する。
 * summaryEn / descriptionEn / instagram は任意。値がある項目だけ表示される。
 * 一覧・検索・分類フィルター・無限読み込み・詳細画面は自動更新。
 */
window.IDK_ARCHIVE_SETTINGS = {
  itemsPerPage: 6,
  imageInterval: 5000
};

window.IDK_ARCHIVE = [
  {
    id: "001",
    slug: "kappa",
    name: "Kappa",
    nameJa: "河童",
    category: "aquatic",
    categoryLabel: "水生-Aquatic",
    risk: "gamma",
    riskLabel: "Gamma risk",
    status: "Observed",
    image: [
      "assets/archive/001_1.png",
      "assets/archive/001_2.png"
    ],
    imagePosition: "center",
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
    slug: "noppera-bo",
    name: "Noppera-bo",
    nameJa: "のっぺらぼう",
    category: "terrestrial",
    categoryLabel: "陸生-Terrestrial",
    risk: "beta",
    riskLabel: "Beta risk",
    status: "Observed",
    image: [
      "assets/archive/002_1.png",
      "assets/archive/002_2.png"
    ],
    imagePosition: "center",
    instagram: "",
    location: "Tokyo, JP",
    recorded: "2004.09.03",
    summary: "東京都内の住宅街で記録された、顔面構造をほとんど持たない人間擬態型の人型生命体。",
    summaryEn: "A human-mimicking humanoid life form with almost no visible facial structure, recorded in a residential area of Tokyo, Japan.",
    description: "対象は深夜の住宅街において、約6分間にわたり同一地点に直立した状態で確認された。服装や体格は一般的な成人とほぼ一致していたが、顔面には眼球、鼻孔、耳などの明確な感覚器官が確認できず、滑らかな皮膚状組織のみが存在していた。日本には古くから、一見すると普通の人間でありながら、振り返った瞬間に顔から目・鼻・口が消失している「のっぺらぼう」と呼ばれる存在の目撃談が残されている。興味深いことに、多くの伝承では対象が人間を積極的に襲うことはなく、接触者の反応を観察するような行動を取った後、その場から姿を消している。これらの特徴から、のっぺらぼうは妖怪ではなく、人間社会への潜入や観察を目的として人体を模倣する未知の知的生命体である可能性が考えられる。衣服や体格、歩行動作までは高精度に再現できる一方、複雑な顔面構造の再現には失敗していたとすれば、古来の目撃談とも一致する。現在では擬態能力がさらに向上し、外見だけで人間と区別することは困難になっている可能性も否定できない。",
    descriptionEn: "The subject was observed standing motionless at the same location in a residential district late at night for approximately six minutes. Its clothing and body proportions were almost indistinguishable from those of an ordinary adult human. However, no clearly identifiable eyes, nostrils, ears, or other sensory organs could be confirmed on the face, which appeared to consist only of smooth skin-like tissue. For centuries, Japanese folklore has described entities known as noppera-bo: figures that initially appear completely human, only to reveal a face without eyes, a nose, or a mouth when approached. Interestingly, many of these accounts do not describe direct attacks. Instead, the entities often appear to observe the reactions of witnesses before disappearing. This behavior raises the possibility that the noppera-bo was not a supernatural yokai, but an unknown intelligent life form capable of imitating the human body for the purpose of observation or infiltration. If such beings were able to reproduce human clothing, proportions, and movement while failing to accurately reconstruct the complex anatomy of the face, many traditional accounts become surprisingly consistent. It is also possible that their mimicry has improved over time, making modern individuals considerably more difficult to distinguish from ordinary humans.",
    traits: ["人間擬態", "顔面欠損", "行動観察"]
  },
  {
    id: "003",
    slug: "abyssal-strix",
    name: "Abyssal Strix",
    nameJa: "アビサル・ストリクス",
    category: "aquatic",
    categoryLabel: "水生-Aquatic",
    risk: "gamma",
    riskLabel: "Gamma risk",
    status: "Observed",
    image: [
      "assets/archive/003_1.png",
      "assets/archive/003_2.png"
    ],
    imagePosition: "center",
    instagram: "",
    location: "Monterey Canyon, California, US",
    recorded: "2007.11.03",
    summary: "米国カリフォルニア沖の深海探査映像に記録された、フクロウに似た頭部を持つ大型の人型水生生命体。",
    summaryEn: "A large aquatic humanoid life form with an owl-like head recorded during a deep-sea survey off the coast of California, United States.",
    description: "対象はモントレー海底谷で行われていた無人探査機による深海調査中、水深約1,340メートル地点で約18分間にわたり記録された。全長は映像上の推定で約1.8〜2.1メートル。細長い四肢と半透明の灰白色の皮膚を持ち、頭部にはフクロウを思わせる大きな前向きの眼と、嘴に似た硬質構造が確認されている。対象は海底を歩行するのではなく、身体をほぼ直立させた状態でゆっくりと遊泳しており、腕や脚による明確な推進運動はほとんど見られなかった。特に注目されるのは眼球で、探査機の照明を受けた際、一般的な深海魚とは異なる強い反射を示した。頭部周辺に存在する細い繊維状器官についても、羽毛ではなく水流や微細な振動を感知する感覚器官である可能性が指摘されている。既知の海洋生物との形態的な一致は確認されておらず、その人間に近い骨格構造が深海環境で独立して進化した結果なのか、あるいは地球外起源の生命体が海洋環境へ適応したものなのかは不明である。その外見がフクロウに酷似している理由についても、両者に直接的な生物学的関係がある証拠は存在しない。",
    descriptionEn: "The subject was recorded for approximately 18 minutes at a depth of about 1,340 meters during an unmanned submersible survey of Monterey Canyon. Its total length was estimated from the footage to be approximately 1.8 to 2.1 meters. The organism possessed elongated limbs, translucent grayish-white skin, large forward-facing eyes resembling those of an owl, and a hardened structure similar in appearance to a beak. Rather than walking along the seafloor, the subject moved slowly through the water while maintaining an almost upright posture, with little visible propulsion from its arms or legs. Of particular interest were its eyes, which produced an unusually intense reflection when exposed to the submersible's lights, differing from the response typically observed in known deep-sea fish. Fine filament-like structures surrounding the head may not be feathers at all, but sensory organs capable of detecting water movement and subtle vibrations. No known marine species has been found to closely match its morphology. It remains unclear whether its humanoid skeletal structure represents an extreme case of convergent evolution in the deep ocean or evidence of an extraterrestrial organism adapted to Earth's marine environment. Despite its striking resemblance to an owl, no evidence currently suggests any direct biological relationship between the two.",
    traits: ["暗所視覚", "深海適応", "水流感知"]
  },
  {
    id: "004",
    slug: "rain-feeder",
    name: "Rain Feeder",
    nameJa: "雨喰い",
    category: "terrestrial",
    categoryLabel: "陸生-Terrestrial",
    risk: "beta",
    riskLabel: "Beta risk",
    status: "Observed",
    image: [
      "assets/archive/004_1.png",
      "assets/archive/004_2.png"
    ],
    imagePosition: "center",
    instagram: "",
    location: "Cordillera Real, La Paz, BO",
    recorded: "2017.02.11",
    summary: "ボリビア・アンデス山脈の豪雨時にのみ姿を現す、背部に無数の吸水孔を持つ大型四足生命体。",
    summaryEn: "A large quadrupedal life form with numerous water-absorbing pores across its back, observed only during heavy rainfall in the Bolivian Andes.",
    description: "最初に異変が確認されたのは、生物そのものではなく、その周囲の地面だった。2017年2月、ボリビア西部の山岳地帯で豪雨後の地質調査を行っていた作業員が、降雨中にもかかわらず直径数メートルだけ完全に乾燥した岩場を発見した。その中心には、四肢を大きく開いて伏せる未知の生物がいたという。対象の背部には蜂の巣にも似た無数の孔が並び、雨水が皮膚に触れると流れ落ちることなく、そのまま内部へ吸収されていった。顔面には眼球や鼻孔に相当する明確な器官が見られず、口も確認されていない。にもかかわらず、観測者の移動に反応し、視界の外側へ回り込むような行動を示した。後日設置された自動撮影装置には、降雨開始から約18分後に岩の裂け目から這い出し、雨脚が弱まる直前に再び地下へ戻る姿が記録されている。周辺では古くから『雨の中にだけ現れる裸の獣』について語られていたが、目撃地点はいずれも洞窟や地下水脈の近くに集中している。水そのものを摂取しているのか、雨水に含まれる微生物や鉱物を濾過しているのかは不明である。より奇妙なのは、対象が滞在した場所では数十分にわたり雨水が溜まらず、土壌中の水分量まで急激に低下する点だ。もしこれが単なる吸水能力ではなく、周囲から能動的に水分を奪う生理機構であるならば、『雨喰い』という呼称は比喩ではない可能性がある。",
    descriptionEn: "The first anomaly was not the creature itself, but the ground surrounding it. In February 2017, workers conducting a geological survey after heavy rainfall in the mountains of western Bolivia discovered a patch of exposed rock several meters wide that was completely dry despite the continuing downpour. At its center was an unidentified organism crouched low with all four limbs spread across the surface. Its back was covered in hundreds of honeycomb-like pores, and water appeared to vanish directly into them rather than running off the body. No recognizable eyes, nostrils, or mouth were visible. Even so, the subject reacted to the observers' movements and repeatedly repositioned itself as though attempting to remain outside their direct line of sight. Automated cameras installed later recorded the organism emerging from a narrow rock fissure approximately eighteen minutes after rainfall began, then retreating underground shortly before the rain weakened. Local accounts have long described a 'naked animal that exists only in the rain,' with reported sightings clustered around caves and subterranean water systems. It remains unknown whether the organism consumes water itself or filters microorganisms and minerals carried within it. More unusual is the condition left behind: for several minutes after the creature departs, water fails to collect around the site, while moisture levels in the surrounding soil drop sharply. If this phenomenon is caused by an active biological mechanism capable of drawing water from its immediate environment, the name 'Rain Feeder' may be considerably more literal than originally assumed.",
    traits: ["背部吸水孔", "降雨時活動", "地下潜伏"]
  },
  {
    id: "005",
    slug: "longstep",
    name: "Longstep",
    nameJa: "霧跨ぎ",
    category: "terrestrial",
    categoryLabel: "陸生-Terrestrial",
    risk: "beta",
    riskLabel: "Beta risk",
    status: "Observed",
    image: [
      "assets/archive/005_1.png",
      "assets/archive/005_2.png"
    ],
    imagePosition: "center",
    instagram: "",
    location: "Ben Macdui, Cairngorms, Scotland, UK",
    recorded: "2019.10.14",
    summary: "スコットランド・ベンマクドゥイ山中の濃霧下で撮影された、異常に長い肢を持つ六脚性の高山生物。",
    summaryEn: "A six-limbed alpine organism with abnormally elongated legs, recorded in dense fog on Ben Macdui in the Scottish Cairngorms.",
    description: "最初に記録されたのは姿ではなく、足音だった。登山者が濃霧の中を下山していた際、自身の歩調とは一致しない重い衝撃音が約40メートル後方から断続的に続き、その間隔は一歩ごとに5〜7メートル移動しているように聞こえたという。回収された映像には、岩稜を跨ぐように移動する六本の細長い肢と、その中央に吊り下がる小型の胴体がわずかに記録されていた。対象の本体は人間よりも小さいと推定される一方、各肢は数メートルに達し、霧の中では複数の肢が重なって巨大な直立人影のように見えることがある。ベンマクドゥイ周辺では古くから「Am Fear Liath Mòr（Big Grey Man）」と呼ばれる怪異が語られており、姿を確認できないまま巨大な足音に追跡されたという証言が繰り返し残されている。これらを心理現象や錯覚だけで説明する説もあるが、霧跨ぎが人間の歩行振動を感知し、一定距離を保ったまま追従する習性を持つのであれば、過去の証言には別の解釈が生じる。さらに対象の接近時には、映像機器のマイクに可聴域以下の周期的振動が記録されている。これが生体由来の低周波である場合、目撃者が共通して訴える理由のない圧迫感や強い恐怖感も、単なる伝承ではなかった可能性がある。",
    descriptionEn: "The first thing recorded was not its appearance, but its footsteps. While descending through dense fog, a mountaineer reported a series of heavy impacts approximately 40 meters behind him, moving at a rhythm that did not match his own. Judging from the intervals between each impact, whatever was following appeared to cover roughly five to seven meters with every step. Recovered footage later revealed several extremely elongated limbs crossing the rocky ridge, with a comparatively small body suspended between them. Although the central body is estimated to be smaller than a human, each of its six limbs may extend several meters. In dense fog, overlapping limbs can briefly resemble the silhouette of an enormous upright figure. For generations, the area around Ben Macdui has been associated with a presence known as Am Fear Liath Mòr, or the “Big Grey Man,” often described not through clear visual sightings but through accounts of enormous footsteps following climbers through the mist. Such reports are commonly attributed to psychological effects, acoustics, or optical illusion. However, if Longstep is capable of detecting human footfall vibrations and maintaining a fixed distance while tracking them, some of these historical accounts may warrant a different interpretation. During the recorded encounter, the camera microphone also captured periodic vibrations below the normal range of human hearing. If these frequencies are biological in origin, the intense pressure and irrational fear repeatedly described by witnesses may not have been products of folklore alone.",
    traits: ["超長肢歩行", "振動追跡", "低周波発生"]
  },
  {
    id: "006",
    slug: "tota-crownback",
    name: "Tota Crownback",
    nameJa: "トタの黒冠",
    nameJaRuby: { text: "黒冠", reading: "クロカンムリ" },
    category: "aquatic",
    categoryLabel: "水生-Aquatic",
    risk: "beta",
    riskLabel: "Beta risk",
    status: "Observed",
    image: [
      "assets/archive/006_1.png",
      "assets/archive/006_2.png"
    ],
    imagePosition: "bottom",
    instagram: "",
    location: "Lake Tota, Boyacá, CO",
    recorded: "2017.11.03",
    summary: "コロンビア・トタ湖の深水域で記録された、背部に連続した隆起構造を持つ大型水棲脊椎動物。",
    summaryEn: "A massive aquatic vertebrate with a series of raised dorsal structures, recorded in the deep waters of Lake Tota, Colombia.",
    description: "対象が最初に確認されたのは、トタ湖西岸から約1.8km離れた水域で行われていた夜間水質調査中だった。調査船のソナーには全長約9mと推定される単一の反応が記録され、その約6分後、水面直下を移動する黒い背部と複数の隆起構造が赤外線カメラに映り込んだ。頭部は胴体に対して異常に幅広く、眼は側面の低い位置にあり、頭頂付近には一対の大きな呼吸孔が存在すると考えられている。暗所や霧の中で頭部だけを水面へ出した場合、その輪郭は大型の牛や角を持つ獣にも見える。トタ湖周辺には古くから、湖底に巨大な蛇あるいは怪物が潜むという伝承が残されており、植民地期にも黒い巨大魚や牛に似た頭部を持つ生物についての記述が存在する。これらは長らく神話や誇張された目撃談として扱われてきた。しかし近年得られた映像と音響記録を比較すると、蛇のような長い身体、魚に似た水中行動、そして牛を思わせる頭部という一見矛盾した特徴は、一種の大型水棲動物を異なる距離と角度から観察した結果として説明できる。さらに複数回のソナー調査では、湖底付近から同時に三つ以上の大型反応が記録されている。現在もっとも問題視されているのは、この生物がトタ湖に迷入した一個体ではなく、外部からほぼ隔離された高地湖の中で長期間にわたり繁殖を続けている可能性である。",
    descriptionEn: "The subject was first detected during a nighttime water-quality survey approximately 1.8 kilometers from the western shore of Lake Tota. Sonar recorded a single target estimated to be roughly nine meters in length. Six minutes later, an infrared camera captured a dark dorsal surface moving just beneath the water, marked by a series of pronounced raised structures. The head appears disproportionately broad in relation to the body, with low-set lateral eyes and what are believed to be a pair of large respiratory openings near the top of the skull. When only the head breaks the surface in darkness or heavy mist, its silhouette can resemble that of a large bovine or horned animal. For centuries, communities around Lake Tota have preserved stories of an enormous serpent or monstrous creature inhabiting its depths, while colonial-era accounts also describe a huge black fish with a head resembling that of a bull. Such reports were long dismissed as mythology or exaggeration. Recent visual and acoustic evidence, however, suggests that these apparently conflicting descriptions—a serpent-like body, fish-like aquatic behavior, and a bovine-shaped head—could all result from observing the same large aquatic species from different distances and angles. More concerning are repeated sonar surveys in which three or more large returns have been detected simultaneously near the lakebed. The primary question is therefore no longer whether a single unknown animal entered Lake Tota, but whether an isolated breeding population has persisted within the high-altitude lake for generations.",
    traits: ["冠状背隆起", "頭頂呼吸孔", "深水潜伏"]
  },
  {
    id: "007",
    slug: "red-false-maw",
    name: "Red False-Maw",
    nameJa: "腹口猩々",
    nameJaRuby: { text: "腹口猩々", reading: "ハラグチショウジョウ" },
    category: "terrestrial",
    categoryLabel: "陸生-Terrestrial",
    risk: "beta",
    riskLabel: "Beta risk",
    status: "Observed",
    image: [
      "assets/archive/007_1.png",
      "assets/archive/007_2.png"
    ],
    imagePosition: "center",
    instagram: "",
    location: "Amazonas, Brazil",
    recorded: "2008.11.07",
    summary: "ブラジル・アマゾナス州の浸水林で、腹部に口腔状器官を持つ大型の毛状陸棲生物が記録された。",
    summaryEn: "A large, fur-covered terrestrial organism with a mouth-like abdominal structure recorded in a flooded forest in Amazonas, Brazil.",
    description: "対象は夜間調査中、支流沿いの浸水林で発見された。直立時の推定体高は約2.2メートル。全身は湿った赤褐色の長い体毛に覆われ、前肢の先端には樹皮を剥離するのに適した大型の湾曲爪が確認されている。最も特徴的なのは胸腹部中央に存在する楕円形の器官で、外見上は複数列の歯を備えた巨大な口腔のように見える。しかし映像解析では咀嚼や摂食に用いられた形跡はなく、内部の白色構造も歯ではなく腺組織である可能性が高い。対象が接近した直後、調査員は強烈な腐敗臭と一時的な目眩を報告しており、この器官は威嚇時に揮発性物質を放出する大型臭腺ではないかと考えられている。アマゾン各地には古くから、巨大な毛深い身体、長い爪、耐え難い悪臭、そして腹部に口を持つ怪物についての伝承が残されている。特にマピングアリと呼ばれる存在との形態的一致は無視できない。ただし、伝承に語られる特徴のすべてが本個体に確認されたわけではない。むしろ未知の大型哺乳類の防御器官が暗闇の中で『腹の口』と誤認され、その断片的な目撃が世代を越えて怪物像へ変化した可能性がある。現在までに明確な摂食行動は記録されておらず、攻撃性についても接近時の威嚇行動以外は確認されていない。",
    descriptionEn: "The subject was encountered during a nocturnal survey in a seasonally flooded forest near an Amazon tributary. Its estimated standing height was approximately 2.2 meters. The body was covered in long, wet reddish-brown hair, while the forelimbs terminated in large curved claws apparently suited for stripping bark. Its most distinctive feature was an oval organ located along the center of the chest and abdomen, superficially resembling an enormous mouth lined with several rows of teeth. Frame analysis, however, revealed no evidence that the structure was used for biting or feeding, and the pale internal formations may be glandular tissue rather than teeth. Immediately after the subject approached, members of the survey team reported an intense odor resembling advanced decomposition, accompanied by temporary dizziness. The organ may therefore function as an enlarged defensive scent gland capable of releasing volatile compounds when threatened. Across the Amazon, long-standing traditions describe a massive hairy creature with elongated claws, an unbearable stench, and, in some accounts, a mouth located on its abdomen. The similarities to traditions surrounding the Mapinguari are difficult to ignore. Not every legendary characteristic, however, has been observed in this specimen. A more plausible possibility is that an unfamiliar defensive organ in an undiscovered large mammal was repeatedly mistaken for an abdominal mouth in low visibility, with fragmented encounters gradually developing into the monster described in local folklore. No confirmed feeding behavior involving the organ has yet been documented, and aggression appears limited to defensive displays at close range.",
    traits: ["腹部偽口器官", "揮発性防御臭", "大型湾曲爪"]
  },
  {
    id: "008",
    slug: "adze-nullwing",
    name: "Adze Nullwing",
    nameJa: "核盗りアゼ",
    category: "aerial",
    categoryLabel: "飛行-Aerial",
    risk: "delta",
    riskLabel: "Delta risk",
    status: "Observed",
    image: [
      "assets/archive/008_1.png",
      "assets/archive/008_2.png",
      "assets/archive/008_3.png",
    ],
    imagePosition: "center",
    instagram: "",
    location: "Ho, Volta Region, GH",
    recorded: "2007.09.14",
    summary: "ガーナ南東部で採取された大型飛翔昆虫。刺咬した宿主の細胞核を崩壊させ、分解した核酸成分を摂取する。",
    summaryEn: "A large flying insect collected in southeastern Ghana that breaks down the nuclei of host cells and consumes the resulting nucleic-acid components.",
    description: "対象を最初に異常種と判断する決め手になったのは、その大きさではなく刺咬痕だった。採取された哺乳類組織では、傷口を中心に細胞核が消失し、染色体DNAが通常の解析では復元できないほど細かく断片化していた。唾液腺からは、DNAそのものを直接溶解する毒素ではなく、宿主細胞が本来持つ核酸分解機構を強制的に作動させる未知の因子が確認されている。崩壊した細胞から生じた核酸塩基やヌクレオシドは吸血とともに取り込まれ、その一部が短時間で卵巣や損傷組織へ移動する。本種は自身だけでは十分に合成できない遺伝物質の構成成分を他生物から回収し、DNA修復と繁殖へ転用している可能性が高い。体長には成長段階による著しい差があり、羽化直後の個体は20mm前後に留まる一方、複数回の摂食を経た成熟個体では70〜90mm程度まで大型化する。抱卵期には腹部がさらに膨張し、脚を除いた胴体だけで成人の握り拳に近い大きさへ達した例も記録されている。この極端な成長差のため、小型の飛翔昆虫と大型個体は長期間別種として扱われていた可能性がある。飛翔時の羽音は体格に反して極めて小さく、暗所では腹部末端にごく弱い黄緑色の発光が現れる。西アフリカのエウェ族には、夜になると小さな飛翔生物の姿で家屋へ入り、人間の血を吸って病や衰弱をもたらす存在『Adze』の伝承が残されている。伝承と本個体との直接的な関係は確認されていない。しかし、夜間の侵入、ほぼ無音の飛翔、微弱な発光、睡眠中の刺咬、その後に続く原因不明の衰弱という特徴は無視できないほど重なる。古い記録で『血を奪われた』とされた被害の一部は、実際には血液そのものではなく、宿主の細胞と遺伝物質が分子レベルで回収されていたのかもしれない。",
    descriptionEn: "The feature that first identified the specimen as anomalous was not its size, but the tissue surrounding its bite. Mammalian samples showed extensive loss of cellular nuclei, while chromosomal DNA had been fragmented beyond reconstruction by conventional analysis. An unidentified factor isolated from the salivary glands does not appear to dissolve DNA directly. Instead, it forces nucleic-acid degradation mechanisms already present within host cells into abnormal activity. Nucleobases and nucleosides released from the collapsing tissue are ingested together with blood, and a portion of this material rapidly accumulates in the ovaries and damaged tissues of the specimen. The species may therefore depend on other organisms for molecular components it cannot synthesize efficiently on its own, reusing them for DNA repair and reproduction. Body size varies dramatically throughout development. Newly emerged specimens measure only around 20 mm, while mature individuals that have completed multiple feeding cycles commonly reach approximately 70 to 90 mm. During egg development, the abdomen expands further, and some recorded females have possessed a body mass approaching the size of an adult human fist even without including the legs. This extreme difference in scale may explain why small flying specimens and much larger individuals were historically treated as unrelated organisms. Despite its size, flight produces remarkably little audible noise, and the terminal abdomen emits a faint yellow-green luminescence in darkness. Among the Ewe peoples of West Africa, traditions describe an entity known as the 'Adze,' said to enter homes at night in the form of a small flying creature, drink human blood, and leave its victims weakened or ill. No direct connection between the folklore and this specimen has been established. However, several details overlap with unusual precision: nocturnal intrusion, near-silent flight, faint luminescence, attacks during sleep, and unexplained physical decline afterward. Some historical accounts interpreted as victims having their 'blood taken' may have involved something more fundamental—the extraction of living cells and genetic material at the molecular level.",
    traits: ["核酸分解", "段階的巨大化", "無音飛翔"]
  },
];
