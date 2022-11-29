// JavaScript Document
console.log("hi");

// Sidebar menu

const burgerIcon = document.querySelector("nav section:first-of-type div button");
const closeIcon = document.querySelector("nav section:last-of-type ul li:first-child button");
const sideMenu = document.querySelector("nav section:last-of-type");
let open = false;

function burgerMenu() {
  if (open) {
    sideMenu.classList.remove("menuOpen");
    document.documentElement.classList.remove("no-scroll");
    open = false;
    burgerIcon.setAttribute("aria-expanded", open);
    closeIcon.setAttribute("aria-expanded", open);
    console.log("Sidebar extended = " + open);
  } else {
    sideMenu.classList.add("menuOpen");
    document.documentElement.classList.add("no-scroll");
    open = true;
    burgerIcon.setAttribute("aria-expanded", open);
    closeIcon.setAttribute("aria-expanded", open);
    console.log("Sidebar extended = " + open);
  }
}

burgerIcon.addEventListener("click", burgerMenu);
closeIcon.addEventListener("click", burgerMenu);

//Ad removal

const adverts = document.querySelectorAll("main > aside");

adverts.forEach((advert) => {
  const button = advert.querySelector("button");
  button.addEventListener("click", () => {
    advert.classList.add("removeAd");
  });
});

// https://www.ditdot.hr/en/dark-mode-website-tutorial
let darkModeState = false;

const darkButton = document.querySelector("header nav section:last-of-type ul:last-of-type button");
const modeTxt = document.querySelector("header nav section:last-of-type ul:last-of-type button span:nth-child(2)");

// MediaQueryList object
const useDark = window.matchMedia("(prefers-color-scheme: dark)");

// Toggles the "dark-mode" class
function toggleDarkMode(state) {
  document.documentElement.classList.toggle("dark-mode", state);
  darkModeState = state;
  if (darkModeState) {
    modeTxt.textContent = "Light UI";
  } else {
    modeTxt.textContent = "Dark UI";
  }
}

// Sets localStorage state
function setDarkModeLocalStorage(state) {
  localStorage.setItem("dark-mode", state);
}

// Initial setting
toggleDarkMode(localStorage.getItem("dark-mode") == "true");

// Listen for changes in the OS settings.
// Note: the arrow function shorthand works only in modern browsers,
// for older browsers define the function using the function keyword.
useDark.addListener((evt) => toggleDarkMode(evt.matches));

// Toggles the "dark-mode" class on click and sets localStorage state
darkButton.addEventListener("click", () => {
  darkModeState = !darkModeState;

  toggleDarkMode(darkModeState);
  setDarkModeLocalStorage(darkModeState);
});

const chessPieces = document.querySelectorAll("main > section:first-child li");

chessPieces.forEach((piece) => {
  piece.addEventListener("dragstart", (e) => {
    // piece.style.cursor = "move";
    setTimeout(() => {
      piece.classList.add("visually-hidden");
    });
  });
  piece.addEventListener("dragend", () => {
    piece.classList.remove("visually-hidden");
  });
});

// init() {
//             createChessboard({
//               id: L,
//               mode: _.X,
//               plugins: [(0, n._H)(), (0, n.Xe)(), (0, n.zG)()],
//               state: { mode: C, startingFen: E, isGameOver: k, result: S, playingAs: x },
//               options: chessboard_spreadValues({ overlayInAnalysisMode: !0 }, window.location.pathname.includes("3d-chess") && { pieceStyle: "real3d" }),
//             }),
//               (function replaceActiveChessboard() {
//                 var e;
//                 (0, w.x)().forEach(removeChessboardActivePlugins);
//                 const t = (0, v.g)();
//                 i.q.soundPlugin && t.game.plugins.add(i.q.soundPlugin),
//                   i.q.arrowKeysPlugin && t.game.plugins.add(i.q.arrowKeysPlugin),
//                   null == (e = document.querySelector(".board-layout-chessboard .board")) || e.replaceWith(t),
//                   (0, f.q)();
//               })(),
//               (R.loaded = !0),
//               updateModel(),
//               registerMoveHandler();
//             const { game: e } = (0, z.g)();
//             addToWindow({ game: e }),
//               e.onMany(n.jd, this.handlePositionChangeEvents),
//               e.on(n.QY.APIEvents.Move, () => this.handleMove(e)),
//               e.on(n.QY.OptionsEvents.Update, this.handleOptionsUpdate),
//               e.on(n.QY.APIEvents.DeletePosition, handleTakeback),
//               e.on(n.QY.APIEvents.UpdatePGNHeaders, this.handleResult);
//           },
//           handlePositionChangeEvents() {
//             updateModel(),
//               (function setCapturedMaterial() {
//                 ye.y.capturedMaterial = (0, z.g)().game.getMaterial();
//               })(),
//               (0, fe.T)().showHint && (setBestMove(null), clearMarkings());
//           },
//           handleMove(e) {
//             ke.B.screen !== _e.Y.Screens.Play &&
//               ((ke.B.showBotAvatarAnimation = !0),
//               (function playGameFromBoardMove() {
//                 (0, X.o)(), (0, ee.G)(te.V.GameStart);
//               })()),
//               (0, fe.T)().takebacks && e.getMode().setOption("canModifyExistingMovesOnMainLine", !(0, N.y)()),
//               cacheGameState();
//           },
//           handleOptionsUpdate({ data: { soundTheme: e } }) {
//             e &&
//               (function loadStartEndSounds() {
//                 const e = (0, z.g)().game.getOptions().soundTheme,
//                   t = [te.V.GameStart, te.V.GameEnd];
//                 Se.B.loaded = t.reduce((t, s) => ((t[s] = (0, Ce.IZ)((0, xe.U)(s, e))), t), {});
//               })();
//           },
//           handleResult({ data: { Result: e } }) {
//             const { game: t } = (0, z.g)();
//             e !== n.lA.Results.None &&
//               (!(async function showGameOverModal() {
//                 await Promise.all([(0, a.tL)(Promise.all([s.e(362), s.e(826)]).then(s.bind(s, 4426))), wait(500)]);
//               })(),
//               (0, ee.G)(te.V.GameEnd),
//               t.setMode(y.C),
//               saveCrowns().then(() => {
//                 cacheBotData(), clearCachedGame(), (0, we.X)(), ne.emit(ae.CrownsSaved);
//               }),
//               setArchivedGameId(null));
//           },
//         });
//         var Pe = s(2203),
//           je = s(3527),
//           ze = s.n(je),
//           Be = s(5521),
//           Ie = s(3615);
//         let Le = null,
//           Ne = null;
//         function clearQueue() {
//           return new Promise((e, t) => {
//             const s = (function getEngine() {
//               const e = (0, Be.Gw)();
//               return Le && Ne !== e.engineName && (Le.quit(), (Le = null)), Le || ((Ne = e.engineName), (Le = ze()((0, Ie.YE)(e.engineName).paths))), Le;
//             })();
//             s
//               ? s.stopFast((s) => {
//                   Le !== s && (null == Le || Le.quit(), (Le = null)), (Le = s), Le ? e(Le) : t();
//                 }, (0, Be.OL)())
//               : t();
//           });
//         }
//         function stopEngine() {
//           Le && (Le.stopAll(), Le.quit(), (Le = null), (Ne = null));
//         }
//         var Re = s(2643);
//         let $e = 0;
//         const De = (0, Re.y0)();
//         function onEvaluationResponse() {
//           De.isLocked || ((De.isRunning = !1), Pe.H.emit("evaluation.update"));
//         }
//         function evaluate(e) {
//           const { fen: t, moves: s, gameType: a } = e;
//           if (((De.fen = t), De.isLocked)) return;
//           $e += 1;
//           const n = $e;
//           (De.isLocked = !0),
//             (De.isNewPosition = !0),
//             clearQueue().then((e) => {
//               De.isLocked = !1;
//               const t = ze().getPositionInfo(De.fen, s, { variant: "chess960" === a });
//               if (!1 === t) return void (0, Re.VD)();
//               if ("object" == typeof t && t.stalemate) return void (0, Re.VD)();
//               const o = (0, Be.Gw)(),
//                 r = { fen: De.fen, moves: s, multiPv: o.linesCount, difficulty: 20, is960: "chess960" === a, normalize: !0 };
//               o.depth ? (r.depth = o.depth) : o.timeLimit > 0 ? (r.movetime = 1e3 * o.timeLimit) : (r.infinite = !0),
//                 (De.isRunning = !0),
//                 e.getBestMove(r, onEvaluationResponse, (e) =>
//                   (function onEvaluationStream(e, t) {
//                     e === $e &&
//                       (De.isLocked ||
//                         ("info" === t.mtype &&
//                           ((t.pv && t.multipv && !t.upperbound && !t.lowerbound && t.depth >= (0, Be.mC)()) || 0 === t.mateIn) &&
//                           (De.isNewPosition && ((De.isNewPosition = !1), (0, Re.VD)()), (0, Re.VD)(t), Pe.H.emit("evaluation.update"))));
//                   })(n, e)
//                 );
//             });
//         }
//         const Fe = [
//           n.QY.APIEvents.CreateGame,
//           n.QY.APIEvents.DeletePosition,
//           n.QY.APIEvents.Load,
//           n.QY.APIEvents.Move,
//           n.QY.APIEvents.MoveBackward,
//           n.QY.APIEvents.MoveForward,
//           n.QY.APIEvents.MoveVariation,
//           n.QY.APIEvents.PromoteVariation,
//           n.QY.APIEvents.SelectLineEnd,
//           n.QY.APIEvents.SelectLineStart,
//           n.QY.APIEvents.SelectNode,
//           n.QY.APIEvents.ResetToMainLine,
//         ];
//         var Ze = s(803);
//         let qe = null,
//           Ue = null,
//           We = !0;
//         async function handleWdl(e) {
//           var t;
//           const s = null != e ? e : qe,
//             a = null == s ? void 0 : s.game;
//           a.eco || (a.plugins.add((0, n.Kh)({ ecoPath: (0, Ze.K)(), http: K.Z })), await a.eco.update());
//           const o = null == (t = null == s ? void 0 : s.game.eco) ? void 0 : t.get(),
//             r = Boolean(o && (null == o ? void 0 : o.f) !== n.iB.shortenFen(a.getFEN(), 3));
//           !(async function getWDLStatsFromFen({ wdlData: e, isBookMove: t }) {
//             e && t ? ((0, Re.xq)({ wdlBar: { win: e.w / 100, loss: e.b / 100, draw: e.d / 100 } }), Pe.H.emit("evaluation.update-wdl")) : (0, Re.xq)({ wdlBar: void 0 });
//           })({ wdlData: null == o ? void 0 : o.wl, isBookMove: !r });
//         }
//         const Ge = (0, u.Z)(() => {
//             var e;
//             qe &&
//               We &&
//               ((0, Re.SZ)((null == (e = qe.game.getSelectedNode()) ? void 0 : e.moveNumber) + 1 || -1),
//               evaluate(
//                 (function getParams() {
//                   const e = { fen: qe.game.getFEN(), moves: "", gameType: qe.game.getVariant() };
//                   return Ue && Object.assign(e, Ue()), e;
//                 })()
//               ));
//           }, 0),
//           He = (0, u.Z)(() => {
//             We && Ge();
//           }, 0);
//         function handleUpdateSettings() {
//           He(), (0, Be.YQ)() && handleWdl();
//         }
//         function clearChessboard() {
//           var e, t;
//           null == (e = null == qe ? void 0 : qe.game) || e.offMany(Fe.map((e) => ({ type: e, handler: He }))),
//             null == (t = null == qe ? void 0 : qe.game) || t.off({ type: n.th.ECO.Events.Update, handler: handleWdl }),
//             (qe = null),
//             Pe.H.off({ type: "evaluation.settings-update", handler: handleUpdateSettings }),
//             stopEngine(),
//             (0, Re.oA)();
//         }
