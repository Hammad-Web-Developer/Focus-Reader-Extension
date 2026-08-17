import * as pdfjsLib from "./pdfjs/build/pdf.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdfjs/build/pdf.worker.mjs";

const speedCount = document.querySelector("#count span");
const speedBar = document.getElementById("scroll");
const mainPage = document.getElementById("mainPage");
const notPdfPage = document.getElementById("notPdfPage");
const goalPage = document.getElementById("goalPage");
const setGoalBtn = document.querySelector(".goal");
const goalSettingDone = document.querySelector(".done");
const startBtn = document.querySelector(".start");
const startIcon = document.querySelector(".startIcon");
const pause = document.querySelector(".pause");
const startText = document.querySelector(".startText");
const pdfFile = document.getElementById("uploadPdf");
const pageNumber = document.getElementById("pageNumber");


//Checking if pdf is opened

chrome.tabs.query({active: true, currentWindow: true}).then(
   (tabs) => {
    let link = tabs[0].url;
    const regex = /\.pdf$/i;
    if (!regex.test(tabs[0].url)){
    mainPage.style.display = 'none';
    notPdfPage.style.display = 'block';
    }
   } 
)


//Updating speed count
speedBar.addEventListener("input",()=>{
    speedCount.innerText = `${speedBar.value} words/sec`;
});

//Pressing set goal btn
setGoalBtn.addEventListener("click",()=>{
goalPage.style.display = 'block';
mainPage.style.display='none';
})

const result = [];
//Extracting goal settings
goalSettingDone.addEventListener("click",()=>{
    result.length = 0;
    const checkedType = document.querySelector(".setting input[type='radio']:checked");
    if (!checkedType){
        alert("Invalid goal type!");
         return;
    }
    else if (checkedType.value === "pages"){
        const pageOrLine = document.getElementById("pagesORlines").value;
        const numOfPages = document.getElementById("pages").value;
        if (numOfPages<1){
            alert("Invalid number of pages/lines!");
            return;
        }
        result.push(pageOrLine);
        result.push(numOfPages);
    } else if (checkedType.value === "timer"){
        const measure = document.getElementById("timeType").value;
        const time = document.getElementById("timer").value;
        if (time<1){
            alert("Invalid time!");
            return;
        }
        result.push(measure);
        result.push(time);
    } else {}
   goalPage.style.display = 'none';
mainPage.style.display='block';
});

pdfFile.addEventListener("change", async (e)=>{
     let pdf = e.target.files[0];
     let arrayBuffer = await pdf.arrayBuffer();
     let myPdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer)}).promise;
     let myPage = await myPdf.getPage(pageNumber.value);
     let text = await myPage.getTextContent();
     console.log(text);
});


// actual pdf logic

let start = false;
startBtn.addEventListener("click", async ()=>{
    if (!start){
    startIcon.style.display = "none";
    pause.style.display = 'block';
    startText.innerText = "PAUSE";
    start = true;
    } else {
       startIcon.style.display = "block";
    pause.style.display = 'none'; 
    startText.innerText = "START";
    start = false;
    }

});
