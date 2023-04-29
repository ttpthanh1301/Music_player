
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE ='MUSIC IS MINE '
const heading = $('header h2')
const player = $('.player')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play')
const progress=$('#progress')
console.log(playBtn)
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const app = {

  currentIndex: 0,
  isPlaying: false,
  isRandom:false,
  isRepeat:false,
  config:JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
  setConfig: function(key,value){
      this.config[key] =value;
      localStorage.setItem(PLAYER_STORAGE,JSON.stringify(this.config))

  },
  songs: [
    {
      name: 'Kill This Love',
      singer: 'BLACKPINK',
      path: './asset/music/kill-this-love-m-v.mp3',
      image: './asset/img/kill_this_love.jpeg'
    },
    {
      name: 'How You Like That',
      singer: 'BLACKPINK',
      path: './asset/music/how_you_like_that.mp3',
      image: './asset/img/howyoulikethat.webp'
    },
    {
      name: 'Hard To Love',
      singer: 'ROSÉ',
      path: './asset/music/hardto_love.mp3',
      image: './asset/img/hard_to_love.jpeg'
    },
    {
      name: 'Tally',
      singer: 'BLACKPINK',
      path: './asset/music/tally.mp3',
      image: './asset/img/tally.jpeg'
    },
    {
      name: 'Sour Candy',
      singer: 'BLACKPINK',
      path: './asset/music/sour-candy.mp3',
      image: './asset/img/sour-candy-1122.jpeg'
    },
    {
      name: 'On The Ground',
      singer: 'ROSÉ',
      path: './asset/music/on-the-ground-m-v.mp3',
      image: './asset/img/Rosé_On_the_Ground.jpg'
    },
    {
      name: 'MONEY',
      singer: 'LISA',
      path: './asset/music/mONEY.mp3',
      image: './asset/img/money.jpeg'
    }
  ],
  render: function () {
    const htmls = this.songs.map((song,index) => {
      return `     
        <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}" >
          <div class="thumb" style="background-image: url('${song.image}')">
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
    })
    playlist.innerHTML = htmls.join('');
  },
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      }
    })

  },
  handleEvents: function () {
    const _this = this
    const cdWidth = cd.offsetWidth;
    //Xu lí  quay cd va dung
    const cdThumbAnimate= cdThumb.animate([
      {transform:'rotate(360deg)'}
      ],{
        duration:10000,//10second
        interations: Infinity
      })
    cdThumbAnimate.pause()
 
    
    //Xu li phong to/thu nho Cd
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    }
    //Xu li khi  click play 
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
        
      }
    }
    //Khi song duoc player
    audio.onplay =function(){
      _this.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play()

    }
    //Khi song bi pause
    audio.onpause =function(){
      _this.isPlaying = false
      player.classList.remove('playing')
      cdThumbAnimate.pause()

    }
    //Khi tien do bai hat thay doi
    audio.ontimeupdate=function(){
      if(audio.duration){
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent;
      }
    }
    //Xử lí khi tua song
    progress.onchange = function(e){
      const seekTime =  audio.duration / 100 * e.target.value 
      audio.currentTime = seekTime
    }
    //Khi next bai hat 
    nextBtn.onclick = function(){
      if(_this.isRandom){
        _this.playRandomSong()
      }else{
        _this.nextSong()
      }
      _this.nextSong()
      audio.play()
      _this.render()
      _this.scrollToActiveSong()

    }
    //Khi prev song
    prevBtn.onclick = function(){
      if(_this.isRandom){
        _this.playRandomSong()
      }else{
        _this.prevSong()
      }
      _this.prevSong()
      audio.play()
    }
    //random song
    randomBtn.onclick = function(){
      _this.isRandom = !_this.isRandom
      randomBtn.classList.toggle('active',_this.isRandom)
    }
    //Xu li next song khi audio ended
    audio.onended = function(){
      if(_this.isRepeat){
        audio.play()
      }else{
        nextBtn.click()
      }
    }
    //Lang nghe hanh vi click
    playlist.onclick = function(e){
      const songNode = e.target.closest('.song:not(.active)')
      if(songNode || e.target.closest('.option')){
          ////Xu li khi click vao song
          if(songNode){
            _this.currentIndex = Number(songNode.getAttribute('data-index'))
            _this.loadCurrentSong()
            _this.render()
            audio.play() 

          }
          //xuli khi click vao song option
          if(e.target.closest('.option')){
          }
      }

    }
    //Xu li khi repeat bai hat
    repeatBtn.onclick = function(){
      _this.isRepeat = !_this.isRepeat
      repeatBtn.classList.toggle('active',_this.isRepeat)

    }

  },
  scrollToActiveSong: function(){
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior:'smooth',
        block: 'center',
      })
    },500)
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path;
  },
  loadConfig: function(){
    this.isRandom =this.config.isRandom
    this.isRepeat = this.config.isRepeat

  },
  nextSong: function(){
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  prevSong: function(){
    this.currentIndex--
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length -1
    }
    this.loadCurrentSong()
  },
  playRandomSong: function(){
    let newIndex;
    do{
      newIndex= Math.floor(Math.random() * this.songs.length)
    }while(newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },
  start: function () {
    //Gan cau hinh tu config vao ungdung
    this.loadConfig()
    //định nghĩa các thuộc tính
    this.defineProperties()
    //lắng ngeh và xử lí các sự kiện
    this.handleEvents()
    //Tair thông tin bài hát đầu tiên
    this.loadCurrentSong()


    //REnder playlist
    this.render()

  },
}
app.start()