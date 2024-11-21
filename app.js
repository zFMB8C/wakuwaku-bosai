const products = [
  { id: 1, name: "水", price: 600, weight: 3, image: "images/bousai_water.png", genre: "食品" },
  { id: 2, name: "乾パン", price: 1000, weight: 0.1, image: "images/bousai_kanpan.png", genre: "食品" },
  { id: 3, name: "アルファ米", price: 1000, weight: 0.1, image: "images/food_alpha_mai_gohan.png", genre: "食品" },
  { id: 4, name: "缶詰３種", price: 1000, weight: 1, image: "images/food_kandume_mirimeshi.png", genre: "食品" },
  { id: 5, name: "懐中電灯", price: 1000, weight: 0.5, image: "images/kaden_kaichu_dentou.png", genre: "雑貨" },
  { id: 6, name: "救急セット", price: 1500, weight: 1.5, image: "images/iryou_kusuribako2.png", genre: "雑貨" },
  { id: 7, name: "紙おむつ(幼児)", price: 1500, weight: 1.2, image: "images/omutsu.png", genre: "ベビー" },
  { id: 8, name: "紙おむつ(シニア)", price: 1500, weight: 1.2, image: "images/kaigo_rihabiri_rehab_pants.png", genre: "シニア" },
  { id: 9, name: "液体ミルク", price: 1500, weight: 2, image: "images/baby_honyubin.png", genre: "ベビー" },
  { id: 10, name: "携帯ラジオ", price: 1000, weight: 0.5, image: "images/radio_pocket.png", genre: "雑貨" },
  { id: 11, name: "テント", price: 50000, weight: 5, image: "images/camp_tent_maru.png", genre: "リュックサック対象外" },
  { id: 12, name: "小型発電機", price: 1500, weight: 20, image: "images/engine_hatsudenki_small.png", genre: "リュックサック対象外" },
];

let selectedProducts = [];

// 商品リストを表示
function displayProducts() {
  const productList = document.querySelector("#product-list .row");
  productList.innerHTML = ""; // 初期化

  // ジャンルごとにグループ化
  const genres = [...new Set(products.map((product) => product.genre))];

  genres.forEach((genre) => {
    // ジャンルの見出しを追加
    productList.innerHTML += `<h3>${genre}</h3><div class="row genre-${genre}"></div>`;

    const genreProducts = products.filter((product) => product.genre === genre);
    const genreRow = document.querySelector(`.genre-${genre}`);

    genreProducts.forEach((product) => {
      const productCard = `
        <div class="col-md-3 mb-4">
          <div class="card h-100">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5>${product.name}</h5>
              <p>価格: ${product.price} 円</p>
              <p>重量: ${product.weight} kg</p>
              <label>数量: </label>
              <input type="number" class="product-quantity" data-id="${product.id}" value="0" min="0">
            </div>
          </div>
        </div>`;
      genreRow.innerHTML += productCard;
    });
  });
}

// オススメ商品にチェック
function recommendProducts(familyAges) {
  const familyCount = familyAges.length; // 家族人数を取得
  selectedProducts = []; // 推奨商品リストを初期化

  // 1. 「食品」ジャンルの商品を家族人数分追加
  const foodProducts = products.filter((product) => product.genre === "食品");
  foodProducts.forEach((product) => {
    selectedProducts.push({ ...product, quantity: familyCount });
  });

  // 2. 「雑貨」ジャンルの商品を1注文につき1個追加
  const miscProducts = products.filter((product) => product.genre === "雑貨");
  miscProducts.forEach((product) => {
    selectedProducts.push({ ...product, quantity: 1 });
  });

  // 3. 特定条件に基づく追加
  familyAges.forEach((age) => {
    // 0歳～3歳の家族がいた場合、「紙おむつ(幼児)」を追加
    if (age >= 0 && age <= 3) {
      const babyDiapers = products.find((product) => product.name === "紙おむつ(幼児)");
      if (babyDiapers) {
        const existingItem = selectedProducts.find((item) => item.id === babyDiapers.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          selectedProducts.push({ ...babyDiapers, quantity: 1 });
        }
      }
    }

    // 0歳～1歳の家族がいた場合、「液体ミルク」を追加
    if (age >= 0 && age <= 1) {
      const liquidMilk = products.find((product) => product.name === "液体ミルク");
      if (liquidMilk) {
        const existingItem = selectedProducts.find((item) => item.id === liquidMilk.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          selectedProducts.push({ ...liquidMilk, quantity: 1 });
        }
      }
    }

    // 75歳以上の家族がいた場合、「紙おむつ(シニア)」を追加
    if (age >= 75) {
      const seniorDiapers = products.find((product) => product.name === "紙おむつ(シニア)");
      if (seniorDiapers) {
        const existingItem = selectedProducts.find((item) => item.id === seniorDiapers.id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          selectedProducts.push({ ...seniorDiapers, quantity: 1 });
        }
      }
    }
  });

  // 4. 数量をUIに反映
  updateQuantityUI();
  updateSummary(); // 合計金額・重量を計算
}

// UIに数量を反映する関数
function updateQuantityUI() {
  const quantityInputs = document.querySelectorAll(".product-quantity");
  quantityInputs.forEach((input) => {
    const productId = parseInt(input.dataset.id);
    const selectedProduct = selectedProducts.find((item) => item.id === productId);
    if (selectedProduct) {
      input.value = selectedProduct.quantity; // 数量を反映
    } else {
      input.value = 0; // 未選択のものは0
    }
  });
}


// チェックされた商品の合計計算
function updateSummary() {
  const quantityInputs = document.querySelectorAll(".product-quantity");
  let totalPrice = 0;
  let totalWeight = 0;
  selectedProducts = [];

  // 商品ごとの数量を集計
  quantityInputs.forEach((input) => {
    const quantity = parseInt(input.value); // 数量を取得
    if (quantity > 0) {
      const product = products.find((p) => p.id === parseInt(input.dataset.id));
      totalPrice += product.price * quantity; // 合計金額
      totalWeight += product.weight * quantity; // 合計重量
      selectedProducts.push({ ...product, quantity }); // 選択リストに追加
    }
  });

  // リュック計算
  const maxWeight = 10; // リュック1個の最大重量
  const backpackCount = Math.ceil(totalWeight / maxWeight);
  const backpackWeights = Array.from({ length: backpackCount }).fill(0);
  selectedProducts.forEach((product) => {
    for (let i = 0; i < backpackWeights.length; i++) {
      if (backpackWeights[i] + product.weight * product.quantity <= maxWeight) {
        backpackWeights[i] += product.weight * product.quantity;
        break;
      }
    }
  });

  // ご注文内容リストを表示
  const orderDetails = document.getElementById("order-details");
  orderDetails.innerHTML = ""; // 初期化
  selectedProducts.forEach((product) => {
    orderDetails.innerHTML += `
      <li>${product.name}: ${product.quantity}個 (${product.price * product.quantity}円)</li>
    `;
  });

  // 合計情報の更新
  document.getElementById("total-price").textContent = totalPrice;
  document.getElementById("backpack-count").textContent = backpackCount;
  document.getElementById("backpack-weights").textContent = backpackWeights.join("kg, ") + "kg";
}

// イベントリスナー
document.getElementById("recommend-btn").addEventListener("click", () => {
  const familyCount = parseInt(document.getElementById("family-count").value); // 入力された家族人数
  const familyAges = document.getElementById("family-ages").value
    .split(",")
    .map((age) => age.trim()) // 年齢リストを配列に変換
    .filter((age) => age !== ""); // 空の要素を排除

  // 不一致チェック
  if (familyCount !== familyAges.length) {
    alert(
      `入力された家族人数 (${familyCount}人) と年齢リストの人数 (${familyAges.length}人) が一致しません\n(同年齢の家族がいる場合、35,30,5,5のように入力してください)。`
    );
    return; // 処理を中断
  }

  // 一致していればおすすめ商品を計算
  recommendProducts(familyAges.map(Number)); // 年齢を数値に変換して渡す
});

// 初期化
displayProducts();

// リセット機能
function resetSelections() {
  const quantityInputs = document.querySelectorAll(".product-quantity");
  quantityInputs.forEach((input) => {
    input.value = 0; // 数量をリセット
  });
  selectedProducts = []; // 選択リストを初期化
  document.getElementById("order-details").innerHTML = ""; // ご注文内容をクリア
  document.getElementById("total-price").textContent = 0; // 合計金額をリセット
  document.getElementById("backpack-count").textContent = 0; // リュック数をリセット
  document.getElementById("backpack-weights").textContent = "-"; // リュック重量をリセット
}

// リセットボタンにイベントを追加
document.getElementById("reset-btn").addEventListener("click", resetSelections);
