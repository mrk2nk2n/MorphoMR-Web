! function (e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(require("three")) : "function" == typeof define && define.amd ? define(["three"], t) : t(e.THREE)
}(this, function (e) {
    "use strict";
    class t {
        static request(e, t, i = null) {
            return new Promise((s, n) => {
                const o = new XMLHttpRequest;
                o.onload = (() => {
                    try {
                        const e = JSON.parse(o.responseText);
                        200 === o.status ? s(e) : n(e)
                    } catch (e) {
                        n(e)
                    }
                }), o.onerror = (e => {
                    n(e)
                }), o.open(e, t), i ? (o.setRequestHeader("Content-Type", "application/json;Charset=UTF-8"), o.send("string" == typeof i ? i : JSON.stringify(i))) : o.send()
            })
        }
        static post(e, i) {
            return t.request("POST", e, i)
        }
        static get(e) {
            return t.request("GET", e)
        }
    }
    class i {
        constructor(e, t) {
            this.interval = 1e3, this.recognizeUrl = "", this.videoSetting = {
                width: 320,
                height: 240
            }, this.videoElement = null, this.videoDeviceElement = null, this.canvasElement = null, this.canvasContext = null, this.timer = null, this.isRecognizing = !1, this.interval = e, this.recognizeUrl = t
        }
        listCamera(e) {
            return this.videoDeviceElement = e, new Promise((e, t) => {
                navigator.mediaDevices.enumerateDevices().then(i => {
                    i.map(e => {
                        if ("videoinput" === e.kind) {
                            const t = document.createElement("option");
                            t.text = e.label || "camera " + (this.videoDeviceElement.length + 1).toString(), t.value = e.deviceId, this.videoDeviceElement.appendChild(t)
                        }
                    }), 0 === this.videoDeviceElement.length ? t("没有摄像头") : (this.videoDeviceElement.style.display = "inline-block", this.canvasElement = document.createElement("canvas"), this.canvasContext = this.canvasElement.getContext("2d"), e(!0))
                }).catch(e => {
                    t(e)
                })
            })
        }
        openCamera(e, t) {
            this.videoElement = e;
            const i = {
                audio: !1,
                video: {
                    deviceId: {
                        exact: t
                    }
                }
            };
            return this.videoElement.srcObject && this.videoElement.srcObject.getTracks().forEach(e => {
                e.stop()
            }), new Promise((e, t) => {
                navigator.mediaDevices.getUserMedia(i).then(i => {
                    this.videoElement.style.display = "block", this.videoElement.srcObject = i, this.videoElement.onloadedmetadata = (() => {
                        this.videoSetting = {
                            width: this.videoElement.offsetWidth,
                            height: this.videoElement.offsetHeight
                        }, this.canvasElement.setAttribute("width", this.videoSetting.width + "px"), this.canvasElement.setAttribute("height", this.videoSetting.height + "px"), window.innerWidth < window.innerHeight ? this.videoElement.offsetHeight < window.innerHeight && this.videoElement.setAttribute("height", window.innerHeight.toString() + "px") : this.videoElement.offsetWidth < window.innerWidth && this.videoElement.setAttribute("width", window.innerWidth.toString() + "px"), e(!0)
                    });
                    const s = this.videoElement.play();
                    s && s.then(e => { }).catch(e => {
                        t(e)
                    })
                }).catch(e => {
                    t(e)
                })
            })
        }
        captureVideo() {
            return this.canvasContext.drawImage(this.videoElement, 0, 0, this.videoSetting.width, this.videoSetting.height), this.canvasElement.toDataURL("image/jpeg", .5).split("base64,")[1]
        }
        startRecognize(e) {
            this.timer = window.setInterval(() => {
                if (this.isRecognizing) return;
                this.isRecognizing = !0;
                const t = {
                    image: this.captureVideo()
                };
                this.httpPost(this.recognizeUrl, t).then(t => {
                    this.stopRecognize(), e(t)
                }).catch(e => {
                    this.isRecognizing = !1
                })
            }, this.interval)
        }
        stopRecognize() {
            this.timer && (window.clearInterval(this.timer), this.isRecognizing = !1)
        }
        httpPost(e, t) {
            return new Promise((i, s) => {
                const n = new XMLHttpRequest;
                n.onload = (() => {
                    try {
                        const e = JSON.parse(n.responseText);
                        200 === n.status && 0 === e.statusCode ? i(e.result) : s(e)
                    } catch (e) {
                        s(e)
                    }
                }), n.onerror = (e => {
                    s(e)
                }), n.open("POST", e), n.setRequestHeader("Content-Type", "application/json;Charset=UTF-8"), n.send(JSON.stringify(t))
            })
        }
    }
    class s {
        static isIos() {
            return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
        }
        static isWeiXin() {
            return /micromessenger/.test(navigator.userAgent.toLowerCase())
        }
        static isMiniprogram() {
            return /miniprogram/.test(navigator.userAgent.toLowerCase()) || "miniprogram" === window.__wxjs_environment
        }
        static $(e) {
            return document.querySelector(e)
        }
        static $show(e) {
            s.$(e).style.display = "block"
        }
        static $hide(e) {
            s.$(e).style.display = "none"
        }
        static $value(e) {
            return s.$(e).value.trim()
        }
        static $remove(e) {
            document.body.removeChild(s.$(e))
        }
        static isMobile(e) {
            return /^1[345789][0-9]{9}$/.test(e)
        }
        static reload() {
            s.isWeiXin() ? window.location.href = window.location.href.split("?")[0] + "?t=" + (new Date).getTime().toString() : window.location.reload()
        }
        static $playaudio(e) {
            s.$(e).play()
        }
        static $pauseaudio(e) {
            s.$(e).pause()
            s.$(e).currentTime = 0
        }
        static $overflowToggle() {
            document.body.style.overflowY = "auto"
        }
        static $aframeShow() {
            var aframeScene = AFRAME.scenes[0]
            aframeScene.style.zIndex = -10
        }
        static $aframeHide() {
            var aframeScene = AFRAME.scenes[0]
            aframeScene.style.zIndex = -100
        }
        static $loadSceneNode() {
            s.$("#dummy").load();
        }
        static $toggleLookControls(e) {
            s.$("#aframeCamera").setAttribute('look-controls', { enabled: e })
            var aframeScene = AFRAME.scenes[0]
            //aframeScene.style.zIndex = 100
        }
        static $resetCameraRotation() {
            s.$("#aframeCamera").setAttribute('rotation', { x: 0, y: 0, z: 0 })
        }
        static $setImageToCamera() {
            var p1 = s.$("#aframeCamera").getAttribute('position').x
            var p2 = s.$("#aframeCamera").getAttribute('position').y
            var p3 = s.$("#aframeCamera").getAttribute('position').z
            var r1 = s.$("#aframeCamera").getAttribute('rotation').x
            var r2 = s.$("#aframeCamera").getAttribute('rotation').y
            var r3 = s.$("#aframeCamera").getAttribute('rotation').z
            console.log("Position " + p1 + " " + p2 + " " + p3 + " " + "Rotation " + r1 + " " + r2 + " " + r3)
            var imageWrapper = s.$("#imageWrapper")
            imageWrapper.setAttribute('position', { x: p1, y: p2, z: p3 })
            imageWrapper.setAttribute('rotation', { x: r1, y: r2, z: r3  })
        }
    }
    class n {
        constructor(e, t, i) {
            this.shareIcon = "", this.shareDesc = "", this.shareIcon = t, this.shareDesc = i;
            const s = document.createElement("script");
            s.src = "https://res.wx.qq.com/open/js/jweixin-1.3.2.js", s.onload = (t => {
                this.init(e)
            }), document.body.appendChild(s)
        }
        init(e) {
            t.get(e + "?url=" + window.location.href).then(e => {
                this.initShare(e)
            }).catch(e => {
                console.info(JSON.stringify(e))
            })
        }
        initShare(e) {
            wx.config({
                debug: !1,
                appId: e.app_key,
                timestamp: e.timestamp,
                nonceStr: e.nonce_str,
                signature: e.signature,
                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
            }), wx.ready(e => {
                const t = {
                    title: document.title,
                    desc: this.shareDesc,
                    link: window.location.href.split("?")[0],
                    imgUrl: this.shareIcon,
                    success: e => {
                        this.shareSuccess(e)
                    },
                    cancel: e => { }
                };
                wx.onMenuShareTimeline(t), wx.onMenuShareAppMessage(t)
            }), wx.error(e => {
                console.info("wx.error"), console.info(JSON.stringify(e))
            })
        }
    }
    new class {
        constructor() {
            this.apiHost = "/api/webar01/", this.isTurntableRunning = !1, this.userId = "", this.video = document.querySelector("#video"), this.isMiniprogram = !1, this.webAr = new i(1e3, "recognize.php"), this.checkWx(), this.pageFirst()
        }
        checkWx() {
            s.isWeiXin() ? (this.isMiniprogram = s.isMiniprogram(), this.isMiniprogram ? this.openCamera(!0) : (s.$show("#pageFirst"), s.isIos() && (s.$show("#pageWxIos"), s.$("#pageWxIos").addEventListener("click", () => {
                s.$hide("#pageWxIos")
            }, !1)), new n("wx.php", "http://sightppp.oss-cn-shanghai.aliyuncs.com/webar/share.jpg", "只需要浏览器，即可体验酷炫AR,快来试试吧~").shareSuccess = (e => {
                window.setTimeout(() => {
                    this.toPage("pageLottery"), document.body.removeChild(s.$("#video"))
                }, 500)
            }), s.$show("#pageFirst"))) : s.$show("#pageFirst")
        }
        toPage(e) {
            const t = document.querySelectorAll(".page");
            for (const e of t) e.style.display = "none";
            s.$show("#" + e)
        }
        pageFirst() {
            s.$("#btnStartAR").addEventListener("click", () => {
                this.openCamera(!0), this.pageScanning()
            }, !1)
        }
        pageScanning() {
            s.$("#btnReady").addEventListener("click", () => {
                this.toPage("pageDisplay"), this.pageDisplay(), s.$aframeShow(), s.$loadSceneNode(), s.$toggleLookControls(true), s.$setImageToCamera()
            }, !1)
        }
        pageDisplay() {
            s.$playaudio("#voiceover-audio-mp3"),
            s.$("#btnMore").addEventListener("click", () => {
                    this.toPage("pageMore"), this.pageMore(), s.$pauseaudio("#voiceover-audio-mp3"), s.$overflowToggle()
                }, !1)
        }
        pageMore() {
            s.$("#btnBack").addEventListener("click", () => {
                this.pageScanning(), this.toPage("pageScanning"), s.$overflowToggle, s.$aframeHide()
            }, !1)
        }
        pagePreview() {
            s.$("#btnMore").addEventListener("click", () => {
                s.$hide("#div-scanner"), this.toPage("pageLottery")
            }, !1), s.$("#btnLottery").addEventListener("click", () => {
                this.toPage("pageLottery"), document.body.removeChild(s.$("#video-bg"))
            }, !1)
        }
        openCamera(e) {
            document.body.style.backgroundColor = "#000000";
            const t = document.createElement("select");
            this.webAr.listCamera(t).then(i => {
                let n = t[0].value;
                !s.isIos() && t.length > 1 && (n = t[t.length - 1].value), this.webAr.openCamera(this.video, n).then(t => {
                    e ? this.loadPackage() : (this.toPage("pageScan"), this.webAr.startRecognize(e => {
                        this.loadPackage(JSON.parse(window.atob(e.meta)))
                    }))
                }).catch(t => {
                    this.removeVideo(), e ? this.loadPackage() : (alert("打开摄像头失败，请点击“立即体验”。"), this.toPage("pageFirst"))
                })
            }).catch(t => {
                console.info(t), this.removeVideo(), e ? this.loadPackage() : (alert("打开摄像头失败，请点击“立即体验”。"), this.toPage("pageFirst"))
            })
        }
        removeVideo() {
            document.body.removeChild(this.video)
        }
        loadPackage(e = null) {
            s.$show("#btnReady"),
                s.$show("#pageScanning"),
                s.$hide("#pageFirst")
        }
        toMiniPage(e = "") {
            wx.miniProgram.navigateBack({
                delta: 2
            })
        }
    }
});