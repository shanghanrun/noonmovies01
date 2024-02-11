const apiKey ='4c2d201c758b4664ab2eeaa863a7bbee'
let country = 'kr'
let url = `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${apiKey}`;
// let url = `https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/top-headlines?country=${country}r&apiKey=${apiKey}`;
let newsList=[]
const replaceImage ="noonatimes2.png";
let totalResults = 34;
let page =1
const pageSize =10 // 한페이지에 보여질 item갯수
const groupSize =5
let lastPage;
let firstPage;
let prevStatus = "disabled";
let nextStatus = '';

let firstItem;


const menus = document.querySelectorAll('.menus button')
menus.forEach(button => addEventListener('click', onMenuClick))
console.log(menus)

const input = document.querySelector('.search-input')
// 이벤트 전파로 인해서 input을 enter로 하면... 막아지지 않고 오류난다.
// input.addEventListener('keyup', function(event){  //input enter에 search 기능 추가
    
//     if (event.key == 'Enter'){
//         const keyword = input.value;
//     input.value =''
//     event.stopPropagation()
//     const country = checkInput(keyword);
//     url = `https://newsapi.org/v2/top-headlines?country=${country}&q=${keyword}&apiKey=${apiKey}`    
//     getNews();
//     }
// })

function changeCountry(){
    const countryTag = document.querySelector('.country')
    if (countryTag.innerText == '한국기사 → 영어기사'){
        countryTag.innerText = '영어기사 → 한국기사';
        country ='us'
        
    } else if(countryTag.innerText == '영어기사 → 한국기사'){
        //! 그냥 else라고 하면 불분명하다. 그밖의 다른 것은,
        // 아닌것 모두
        countryTag.innerText = '한국기사 → 영어기사';
        country ='kr'
    }
}


document.getElementById('news-board').addEventListener('click', function(event) {
    event.stopPropagation(); // 이벤트 전파 중지
});

async function onMenuClick(e){
    const category = e.target.id
    //혹은 e.target.textContent.toLowerCase();
    url =`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`
    await getNews();
}
async function search(){
    // const input = document.querySelector('.search-input') //전역변수
    const keyword = input.value;
    input.value =''
    const country = checkInput(keyword);
    url = `https://newsapi.org/v2/top-headlines?country=${country}&q=${keyword}&apiKey=${apiKey}`    
    await getNews()
}

function checkInput(word){
     // 정규 표현식을 사용하여 한글/영문 여부를 판별
    var isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(word);
    var isEnglish = /^[a-zA-Z]+$/.test(word);
    if(isKorean) {
        country = 'kr';
        console.log(country);
        return 'kr';
    }
    if(isEnglish) {
        country = 'us';
        console.log(country)
        return 'us';
    }
}

const getNews = async()=>{
    const url2 = new URL(url);
    url2.searchParams.set("page",page)  // &page=page
    url2.searchParams.set("pageSize",pageSize) //&pageSize=pageSize
    try{
        const response = await fetch(url2);   //너무 많이 이용해서 블록당해서 하루 정도 쉰다.
        const data = await response.json()
         if (response.status == 200){
            console.log('data : ', data);
            if(data.articles.length == 0){
                console.log('아티클길이', data.articles.length)
                throw new Error('No result for this search');
            }
             newsList = data.articles;
             totalResults = data.totalResults;

             if (country == 'kr'){
                 firstItem = {
                     title: '여신의 품격: Ive 장원영 vs 코딩누나',
                     description: "<h5>코딩 알려주는 누나와 쌍벽을 이루는 미모</br>코딩누나 긴장 좀 해야 겠다!! </h5>",
                     url: 'https://cdn.inflearn.com/public/users/thumbnails/694277/60d324e4-719f-4551-8f3c-f377b7eb1f78',
                     urlToImage: `https://truth.bahamut.com.tw/s01/202209/bb7dd87e8f4d1d0ca3a7d735f873eb38.JPG`,
                     publishedAt: '2024.01.30',
                     source: {name: 'Noona Times'}
                 }
             } else{
                firstItem = {
                     title: 'Grace of goddess: Ive Jang wongyong vs Coding noona.',
                     description: "<h5>A perfect pair in beauty along with Coding noona</br>Coding noona! You should not let your guard down!!</h5>",
                     url: 'https://cdn.inflearn.com/public/users/thumbnails/694277/60d324e4-719f-4551-8f3c-f377b7eb1f78',
                     urlToImage: `https://truth.bahamut.com.tw/s01/202209/bb7dd87e8f4d1d0ca3a7d735f873eb38.JPG`,
                     publishedAt: '2024.01.30',
                     source: {name: 'Noona Times'}
                 }
             }
             newsList = [firstItem, ...newsList]
             render();
            //  pagiNationRender()   이것을 render()안으로 넣자.
             console.log(newsList)
         } else{
            throw new Error(data.message)
         }

    } catch(e){
        console.log(e.message)
        errorRender(e.message)
    }
    
}


const render=()=>{
    const newsBoard = document.querySelector('#news-board')
    newsBoard.innerHTML =''; //비우고 시작

    const newsHTML = newsList.map(news => 
        `<div class="row item">
            <div class="col-lg-4">
                        <img src=${news.urlToImage?? replaceImage}  />
                    </div>
                    <div class="col-lg-8">
                        <h2><div onclick="getDetail('${news.url}')">${news.title}</div></h2>
                        <p>${news.description}</p>
                        <div>
                            ${news.source.name} : ${news.publishedAt} 
                        </div>
                    </div>
            </div>
        </div>
    `).join('')
    newsBoard.innerHTML = newsHTML;
    pagiNationRender(); 
}

function getDetail(url){
     window.location.href = url;
}

function errorRender(message){
    const newsBoard = document.querySelector('#news-board')
    newsBoard.innerHTML ='';
    const errorHTML = `
        <div class="alert alert-danger" role="alert">
            ${message}
        </div>
    `;
    newsBoard.innerHTML= errorHTML;

    // pagiNation도 안보이게 한다.(삭제하지 않으면 기존모양 그대로 나온다.)
    document.querySelector('.pagination').innerHTML = ""
}

function pagiNationRender(){
    const totalPage = Math.ceil(totalResults / pageSize)
    const pageGroup = Math.ceil(page /groupSize)
    lastPage = pageGroup * groupSize
    
    firstPage = lastPage - groupSize +1
    if (lastPage > totalPage){
        lastPage = totalPage
    }
    if (firstPage == lastPage){
        nextStatus = 'disabled'
    }
    
    let paginationHTML =`<li class="page-item prev ${prevStatus}"><div class="page-link" onclick="moveToPage(${firstPage})"><<</div></li><li class="page-item prev ${prevStatus}"><div class="page-link" onclick="moveToPage(${page-1})">Previous</div></li>`;
    // page가 전역변수라서 page-1 이 최신페이지에서 이전페이지가 된다.
    
    for (let i=firstPage; i<=lastPage; i++){
        paginationHTML += `<li class="page-item" onclick="moveToPage(${i})" ><div class="page-link ${i==page ? 'active' : ''}" href="#">${i}</div></li>`
    }

    paginationHTML += `<li class="page-item next ${nextStatus}"><div class="page-link" onclick="moveToPage(${page+1})">Next</div></li><li class="page-item next ${nextStatus}"><div class="page-link" onclick="moveToPage(${lastPage})">>></div></li>`

    document.querySelector('.pagination').innerHTML = paginationHTML;

}

async function moveToPage(pageNo){    
    const prevs = document.querySelectorAll('.prev')
    const nexts = document.querySelectorAll('.next')

    if (pageNo >= firstPage && pageNo <= lastPage){
        page = pageNo;
        if (page > firstPage ){  
            prevStatus ='' 
        } else {
            prevStatus ='disabled'
        }
        if (page < lastPage){
            nextStatus =''
        } else{
            nextStatus ='disabled'
        }
        
        
    } else {
        return;
    }
    // url = url+`&pageSize=${pageSize}&page=${page}`
    // 위에서 URL.searchParams.set()을 사용하므로 여기서는 주석
    await getNews()  // getNews에 paginationRender()가 포함되어 있다.

}

// 비디오 플레이어 요소 가져오기
const videoPlayer = document.getElementById('videoPlayer');
const videoTitle = document.querySelector('#videoTitle');
const videoDescription = document.querySelector('#videoDescription')

// 비디오 플레이어에 클릭 이벤트 리스너 추가
videoPlayer.addEventListener('click', function() {
    if (videoPlayer.paused) {
        videoPlayer.play();
    } else {
        videoPlayer.pause();
    }
});

// movies.json 파일 경로
const jsonFilePath = 'movies.json';

// movies.json 파일을 비동기적으로 가져와서 비디오 재생
fetch(jsonFilePath)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(videos => {
        // 첫 번째 비디오 정보 가져오기
        let index = Math.floor(Math.random()*4)
        const firstVideo = videos[index];
        // 비디오 소스 설정
        videoPlayer.src = firstVideo.videoUrl;
        videoTitle.innerText = firstVideo.title;
        videoDescription.innerText = firstVideo.description;
        // 비디오 재생
        // videoPlayer.play(); 브라우저 정책으로 자동재생 안되게 막음
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });


const video2 =document.querySelector('#video2')
// video2.play();



// 영화포스터
const image1 ='https://search3.kakaocdn.net/argon/656x0_80_wr/Fdw60fejriu'
const image2 = 'https://search1.kakaocdn.net/argon/656x0_80_wr/1AmP7klqBiW'
const image3 ='https://search1.kakaocdn.net/argon/656x0_80_wr/5rZKc67EPJ4'
const image4 ='https://search2.kakaocdn.net/argon/656x0_80_wr/5boqAGhvpqs'
const image5 ='https://search2.kakaocdn.net/argon/550x0_65_wr/Gl1Yurbx5Df0'

const imageContainer = document.getElementById('images');
// 이미지 URL 배열
const imageUrls = [image1, image2, image3, image4, image5];

// 이미지를 컨테이너에 추가
imageUrls.forEach(url => {
    const imgElement = document.createElement('img'); // 이미지 요소 생성
    imgElement.src = url; // 이미지 요소의 src 속성 설정
    imageContainer.appendChild(imgElement); // 이미지 요소를 컨테이너에 추가
});




// getNews();   뉴스를 받으러면 활성화시킨다.

const moviesSection = document.querySelector('#movies')

let movieList;
const getMovies= async()=>{
    const response = await fetch(`https://yts.mx/api/v2/list_movies.json?minimum_rating=9&sort_by=year`);
    const json = await response.json(); //그런데 되도록 json이라는 변수이름은 안쓰는게 좋다.  차라리 data로 사용하라. json은 일종의 예약어로 작용할 때가 있다..
    // setMovies(json.data.movies);  리액트 코드
    movieList = json.data.movies;
    console.log(movieList)
    renderMovies();
}
//! 이 방식으로 함수를 선언하면, 일단 함수가 실행된다.!!


getMovies();

const renderMovies =()=>{
    const moviesDiv = document.createElement('div')
    movieList.forEach(movie =>{
        const movieDiv =document.createElement('div')
        const h2 = document.createElement('h2')
        h2.textContent = movie.title;
        const img =document.createElement('img')
        img.src = movie.medium_cover_image;
        const p = document.createElement('p')
        p.textContent = movie.summary;
        const ul = document.createElement('ul')
        movie.genres.forEach(genre=>{
            const li = document.createElement('li')
            li.textContent = genre;
            ul.appendChild(li)
        })
        movieDiv.appendChild(h2);
        movieDiv.appendChild(img)
        movieDiv.appendChild(p)
        movieDiv.appendChild(ul)
        moviesDiv.appendChild(movieDiv);
    })
    moviesSection.appendChild(moviesDiv);
}

// const divList = movieList.map(movie =>{
//     return (
//     <div key={movie.id}>
//         <h2>{movie.title}</h2>
//         <img src={movie.medium_cover_image} />
//         <p>{movie.summary}</p>
//         <ul>
//             {movie.genre?.map((el, idx)=>{
//                 return <li key={idx}>{el}</li>
//             })}
//         </ul>
//     </div>).toString()
// }) 
// moviesDiv.innerHTML = divList;
