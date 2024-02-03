const apiKey ='4c2d201c758b4664ab2eeaa863a7bbee'
let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
let newsList=[]
const replaceImage ="noonatimes2.png";
let totalResults = 0;
let page =1
const pageSize =10 // 한페이지에 보여질 item갯수
const groupSize =5

const menus = document.querySelectorAll('.menus button')
menus.forEach(button => addEventListener('click', onMenuClick))
console.log(menus)

function onMenuClick(e){
    const category = e.target.id
    //혹은 e.target.textContent.toLowerCase();
    url =`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`
    getNews();
}
function search(){
    const input = document.querySelector('.search-input')
    const keyword = input.value;
    const country = checkInput(keyword);
    url = `https://newsapi.org/v2/top-headlines?country=${country}&q=${keyword}&apiKey=${apiKey}`    
    getNews()
}

function checkInput(word){
     // 정규 표현식을 사용하여 한글/영문 여부를 판별
    var isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(word);
    var isEnglish = /^[a-zA-Z]+$/.test(word);
    if(isKorean) return 'kr';
    if(isEnglish) return 'us';
}

const getNews = async()=>{
    // const url2 = new URL(url);
    // url2.searchParams.set("page",page)  // &page=page
    // url2.searchParams.set("pageSize",pageSize) //&pageSize=pageSize
    try{
        // const response = await fetch(url2);   너무 많이 이용해서 블록당해서 하루 정도 쉰다.
        // const data = await response.json()
        //  if (response.status == 200){
        //     if(data.articles.length == 0){
        //         throw new Error('No result for this search');
        //     }
        //      newsList = data.articles;
        //      totalResults = data.totalResults;
        //      const firstItem = {
        //          title: '여신의 품격: Ive 장원영',
        //          content: "<h5>코딩 알려주는 누나와 쌍벽을 이루는 미모</br>코딩누나 긴장 좀 해야 겠다!! </h5>",
        //          urlToImage: `https://truth.bahamut.com.tw/s01/202209/bb7dd87e8f4d1d0ca3a7d735f873eb38.JPG`,
        //          publishedAt: '2024.01.30',
        //          source: {name: 'Noona Times'}
        //      }
        //      newsList = [firstItem, ...newsList]
             render();
             pagiNationRender()   
             console.log(newsList)
        //  } else{
        //     throw new Error(data.message)
        //  }

    } catch(e){
        console.log(e.message)
        errorRender(error.message)
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
                        <h2>${news.title}</h2>
                        <p>${news.content}</p>
                        <div>
                            ${news.source.name} : ${news.publishedAt} 
                        </div>
                    </div>
            </div>
        </div>
    `).join('')
    newsBoard.innerHTML = newsHTML; 
}

function errorRender(errorMessage){
    const newsBoard = document.querySelector('#news-board')
    newsBoard.innerHTML ='';
    const errorHTML = `
        <div class="alert alert-danger" role="alert">
            ${errorMessage}
        </div>
    `;
    newsBoard.innerHTML= errorHTML;
}

function pagiNationRender(){
    const totalPage = Math.ceil(totalResults / pageSize)
    const pageGroup = Math.ceil(page /groupSize)
    const lastPage = pageGroup * groupSize  //groupSize * 그룹단위
    const firstPage = lastPage - groupSize +1

    if (lastPage > totalPage){
        lastPage = totalPage
    }
     

    let paginationHTML ='';
    for (let i=firstPage; i<=lastPage; i++){
        paginationHTML += `<li class="page-item" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }

    document.querySelector('.pagination').innerHTML = paginationHTML;

   
    // <li class="page-item"><a class="page-link" href="#">Previous</a></li>
    // <li class="page-item"><a class="page-link" href="#">1</a></li>
    // <li class="page-item"><a class="page-link" href="#">2</a></li>
    // <li class="page-item"><a class="page-link" href="#">3</a></li>
    // <li class="page-item"><a class="page-link" href="#">Next</a></li>
}

function moveToPage(pageNo){
    page = pageNo;   // 직접 url에 넣어 줄 수도 있지만, 형식상 page에 넣어준다.
    url = url+`&pageSize=${pageSize}&page=${page}`
    getNews()

}

getNews();




