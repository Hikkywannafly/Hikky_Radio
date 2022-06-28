const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const songName = $('#album-name');
const songAuthor = $('#track-name');
const songPic = $('#player-art img');
const trackList = $('#tracks-list');
const btnPlay = $('.btn-toggle-play');
const activeArt = $('#player-art');
const activeTrack = $('#tracks');
const audio = $('#audio');
const trackLength = $('#track-length');
const trackCurrentTime = $('#current-time');
const seekBar = $('#seek-bar');
const insTime = $('#ins-time');
const sHover = $('#s-hover');
const sArea = $('#s-area');
const trackPlayerArea = $('#player');
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const btnRamdom = $('.btn-random');
const btnRepeat = $('.btn-repeat');
let timeUpdate;
let run = 1;
let change1 = 1;
let change2 = false;
let secondTrackLength, minuteTrackLength, secondTrackCurrent, minuteTrackCurent,
    timeCurrentPlay, playProgress, seekBarPos, timePoint, timeLength, tSeek,
    seInsTime, miInsTime;

const app = {
    curentIndex: 0,
    isPLaying: false,
    isReplay: false,
    isShuffle: false,
    songList: [
        {
            name: "Birds",
            singer: "Imagine Dragons",
            path: "./music/song1.mp3",
            image: "./img/song1.png"
        },
        {
            name: "Happier",
            singer: "Marshmello ft. Bastille",
            path: "./music/song2.mp3",
            image: "./img/song2.png"
        },
        {
            name: "Minamo",
            singer: "MojiX! x Elkuu",
            path: "./music/song3.mp3",
            image: "./img/song3.png"
        },
        {
            name: "A New Journey",
            singer: "しいジャーニー",
            path: "./music/song4.mp3",
            image: "./img/song4.png"
        },
        {
            name: "Renai Circulation",
            singer: "Kana Hanazawa",
            path: "./music/song5.mp3",
            image: "./img/song5.png"
        },


    ],

    renderSongList: function () {
        const html = this.songList.map((song, index) => {

            return ` 
            <div id="track-box" class=" ${this.curentIndex===index ? 'active atc' : ' ' }" data-index="${index}">
            <div class="thumb">
              <img src="${song.image}" alt="">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `
        });
        trackList.innerHTML = html.join('');
    },

    defineProperties: function () {
        Object.defineProperty(this, 'getCurrentSong', {
            get: () => {
                return this.songList[this.curentIndex];
            }

        });
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
          $(".atc").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
          });
        }, 300);
      },
    shuffle: function () {
        let j, i;
        do{
            j = Math.floor(Math.random() * (this.songList.length));
        }while(j === this.curentIndex);
        this.curentIndex = j;
    },
    reLoad: function () {
        this.loadSongShowUI();
        audio.play()
    },
    nextSong: function () {
        if(this.isShuffle){
            this.shuffle();
        }else{
            this.curentIndex === this.songList.length - 1 ? this.curentIndex = 0 : this.curentIndex++;
        }
    
        this.reLoad();
        this.renderSongList();
        this.scrollToActiveSong();
    },
    prevSong: function () {
        if(this.isShuffle){
            this.shuffle();
        }else{
        this.curentIndex === 0 ? this.curentIndex = this.songList.length - 1 : this.curentIndex--;
        
        }
        this.reLoad();
        this.renderSongList();
        this.scrollToActiveSong();
    },
    playFromClickedPos: function () {
        audio.currentTime = timeLength;
        seekBar.style.width = `${tSeek}px`;
    },
    showHover: function (e) {
        seekBarPos = sArea.offsetLeft + trackPlayerArea.offsetLeft + 17;
        tSeek = e.clientX - seekBarPos;
        timeLength = Math.floor(audio.duration * (tSeek / sArea.offsetWidth));
        miInsTime = Math.floor(timeLength / 60);
        seInsTime = Math.floor(timeLength - miInsTime * 60);
        seInsTime < 10 ? seInsTime = `0${seInsTime}` : seInsTime;
        sHover.style.width = `${tSeek}px`;
        insTime.style.cssText = `display: block; left:${e.clientX - seekBarPos}px; margin-left:-15px`;
        insTime.textContent = `${miInsTime}:${seInsTime}`;

    },
    showOut: function (e) {
        sHover.style.width = `0px`;
        insTime.style.cssText = `display: none; left:0px`;
    },
    updateCurrentTime: function () {
        let timeLength = audio.duration;
        minuteTrackLength = Math.floor(timeLength / 60);
        secondTrackLength = Math.floor(timeLength - minuteTrackLength * 60);
        timeCurrentPlay = audio.currentTime;
        minuteTrackCurent = Math.floor(timeCurrentPlay / 60);
        secondTrackCurrent = Math.floor(timeCurrentPlay - minuteTrackCurent * 60);
        secondTrackLength < 10 ? secondTrackLength = `0${secondTrackLength}` : secondTrackLength;
        secondTrackCurrent < 10 ? secondTrackCurrent = `0${secondTrackCurrent}` : secondTrackCurrent;
        trackCurrentTime.textContent = `${minuteTrackCurent}:${secondTrackCurrent}`;
        trackLength.textContent = `${minuteTrackLength}:${secondTrackLength} `
        playProgress = (timeCurrentPlay / timeLength) * 100;
        seekBar.style.width = `${playProgress}%`;
    },
    loadSongShowUI: function () {
        songName.textContent = this.getCurrentSong.name
        songAuthor.textContent = this.getCurrentSong.singer;
        songPic.src = this.getCurrentSong.image;
        audio.src = this.getCurrentSong.path;
        audio.ontimeupdate = () => {
            this.updateCurrentTime(audio);
        }
    },

    handlerEvent: function () {
        const _this = this;
        btnPlay.onclick = () => {
            if (run === 1) {
                _this.loadSongShowUI();
                _this.renderSongList();
                run++;
            }

            _this.isPLaying === false ? audio.play() : audio.pause();
        }
        btnRepeat.onclick = () => {
            _this.isReplay = !_this.isReplay;
            if (_this.isReplay) {
                $('.fa-redo').style.cssText = `color: green;
                text-shadow:
                    0 0 7px yellow,
                    0 0 10px yellow,
                    0 0 21px yellow,
                    0 0 42px yellow,
                    0 0 52px yellow,
                    0 0 62px yellow,
                    0 0 72px yellow,1`


            } else if (!_this.isReplay) {
                $('.fa-redo').style.cssText = `color: #666;`

            }

        }
        btnRamdom.onclick = () => {
            _this.isShuffle = !_this.isShuffle
            if (_this.isShuffle) {
                $('.fa-random').style.cssText = `color: green;
                text-shadow:
                    0 0 7px yellow,
                    0 0 10px yellow,
                    0 0 21px yellow,
                    0 0 42px yellow,
                    0 0 52px yellow,
                    0 0 62px yellow,
                    0 0 72px yellow,1`


            } else if (!_this.isShuffle) {
                $('.fa-random').style.cssText = `color: #666;`

            }
        }

        audio.onplay = () => {
            _this.isPLaying = true;
            activeArt.classList.add('active');
            activeTrack.classList.add('active');
            btnPlay.innerHTML = ' <i class="fas fa-pause icon-pause"></i>';
        }
        audio.onpause = () => {
            _this.isPLaying = false;
            activeArt.classList.remove('active');
            activeTrack.classList.remove('active');
            btnPlay.innerHTML = '<i class="fas fa-play icon-play"></i>';
        }
        audio.onended = () => {
            if (_this.isReplay) {
                
            }else if(_this.isShuffle){
            this.shuffle();

                
            } else {

                _this.curentIndex++;

            }
            _this.reLoad();
            _this.renderSongList();
            _this.scrollToActiveSong();
        }

        sArea.onmousemove = (e) => {
            _this.showHover(e);
        }
        sArea.onmouseout = (e) => {
            _this.showOut(e);
        }
        sArea.onclick = (e) => {
            _this.playFromClickedPos();
        }
        prevBtn.onclick = (e) => {
            _this.prevSong();
        }
        nextBtn.onclick = (e) => {
           _this.nextSong();
        }
        trackList.onclick = function (e) {
            const songNode = e.target.closest("#track-box:not(.atc)");
            console.log(songNode);
            if (songNode || e.target.closest(".option")) {
        
              if (songNode) {
                _this.curentIndex = Number(songNode.dataset.index);
                _this.reLoad();
                _this.renderSongList();
                _this.scrollToActiveSong();
              }
              if (e.target.closest(".option")) {
              }

            }

          };

    },
    start: function () {
        this.defineProperties();
        this.renderSongList();
        this.handlerEvent();
    }
}

app.start();


