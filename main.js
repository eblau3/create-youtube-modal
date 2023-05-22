const createYoutubeModal = (props) => {
  // Youtube iFrame Player APIを読み込み
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // プレイヤーを生成
  const initializePlayer = (id) => {
    player = new YT.Player('js-modal-player', {
      width: '640',
      height: '360',
      // ytidを代入
      videoId: id,
      playerVars: {
        'controls': 0,
        'rel': 0
      },
    });
  };
  
  // プレイヤーを削除
  const removePlayer = () => {
    if(!player == '') {
      // プレイヤーの一時停止
      player.stopVideo();
      // プレイヤーを削除
      player.destroy();
      player = '';
    }
  };

  // スクロールを無効
  const disableScroll = () => {
    const body = document.querySelector('body');
    const scrollPos = window.scrollY;
    body.style.position = 'fixed';
    body.style.top = `-${scrollPos}px`;
    body.style.left = '0';
  };

  // スクロールを有効
  const enableScroll = () => {
    const body = document.querySelector('body');
    const fixedPos = Number(body.style.top.replace(/px|-/g, ''));
    body.style.position = 'static';
    window.scrollTo(0, fixedPos);
  };

  // モーダルを閉じる
  const closeModal = () => {
    const modal = document.querySelector('.modal');
    if(modal) {
      // モーダルを非表示
      modal.classList.remove(toggleClass);
      // 非表示のアニメーション終了後に実行
      modal.addEventListener('transitionend', () => {
        // プレイヤーを削除
        removePlayer();
        // コンテンツ要素を削除
        modal.remove();
        // スクロールを有効
        enableScroll();
      }, {once: true});
    };
  };
  
  // モーダルを開く
  const openModal = (prop) => {
    // 閉じるボタンを生成
    const closeButton = document.createElement('button');
    closeButton.classList.add('modal__close');
    // 背景を生成
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal__overlay');
    // コンテンツを生成
    const modalContent = document.createElement('div');
    modalContent.classList.add('modal__content');
    modalContent.innerHTML = `
      <div class="modal__player">
        <div id="js-modal-player"></div>
      </div>
      <div>${prop.title}</div>
      <div>${prop.description}</div>      
    `;
    // モーダル要素を生成
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.appendChild(closeButton);
    modal.appendChild(modalOverlay);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    // videoIdを引数にプレイヤーを生成
    initializePlayer(prop.ytid);
    // スクロールを無効
    disableScroll();
    // プレイヤーの読み込みが完了したらモーダルを表示
    setTimeout(() => {
      document.querySelector('#js-modal-player').onload = () => {
        modal.classList.add(toggleClass);
      };
    }, 0);
    // 閉じるボタン・背景のクリックを監視 → モーダルを閉じる
    closeButton.addEventListener('click', () => closeModal());
    modalOverlay.addEventListener('click', () => closeModal());
  };

  // プレイヤーを初期化
  let player = '';

  // モーダルのプロパティを格納
  const modalProps = JSON.parse(props);

  // 状態変化クラスを変数へ格納
  const toggleClass = 'is-active';
  
  // 開くボタンのクリックを監視 → モーダル開く
  const openButtons = document.querySelectorAll('.js-modal-open');
  openButtons.forEach(openButton => {
    openButton.addEventListener('click', () => {
      // data-name属性の値を取得 -> プロパティと照合 -> 該当の配列データを引数にモーダルを開く
      const modalName = openButton.dataset.name;
      const modalProp = modalProps.find(item => item.name === modalName);
      openModal(modalProp);
    });
  });
};

// DOMツリーの構築が完了したら実行
window.addEventListener('DOMContentLoaded', () => {
  // モーダルのプロパティを取得し、中身があればメイン関数へ渡し実行
  const data = modalPropsJsonData;
  if(data) createYoutubeModal(data);
});