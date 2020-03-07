const draggable_list = document.getElementById("draggable-list");
const check = document.getElementById("check");
const hint = document.getElementById("hint");
const winEl = document.querySelector(".win");
const hintEl_p = document.getElementById("hintElP");
const hintEl_s = document.getElementById("hintElS");

let word = [];
let hints = 2;
let checks = 3;

async function fetchAPI() {
  let res = await fetch("https://random-word-api.herokuapp.com/word/?swear=0");
  let data = await res.json();
  return data;
}

function fetchWord() {
    fetchAPI().then(data => {
        word = data[0].split("");
        console.log(word);
        if (word.length < 8) {
          createList();
        } else {
            fetchWord();
        }
      });
}

fetchWord();


//Store list items
const listItems = [];

let dragStartIndex;

//Insert list items to DOM
function createList() {
  [...word]
    .map(a => ({ value: a, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value)
    .forEach((letter, index) => {
      /*Ok fuck so we first do a map of the array which returns an object with the letter and a random sort value then we SORT by that value in ascending order and then since we are returning an object which holds the string we just map that object and return just the string*/
      const listItem = document.createElement("li");

      listItem.setAttribute("data-index", index);
      listItem.setAttribute("draggable", true);

      listItem.classList.add("draggable");

      listItem.innerHTML = `<p class="letter">${letter}</p>`;

      listItems.push(listItem);

      draggable_list.appendChild(listItem);
    });

  addEventListeners();
}

function dragStart() {
  dragStartIndex = +this.closest("li").getAttribute("data-index");
  //   this.classList.remove('wrong');
  //   this.classList.remove('right');
}

function dragEnter() {
  this.classList.add("over");

  //console.log(this.classList[0]);

  if (this.classList[0] == "letter") {
    //this.parentNode.classList.add('over');
  }
}

function dragLeave() {
  this.classList.remove("over");
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop() {
  const dragEndIndex = +this.getAttribute("data-index");
  swapItems(dragStartIndex, dragEndIndex);
  this.classList.remove("over");
}

function swapItems(fromIndex, toIndex) {
  let itemOne = listItems[fromIndex];
  let itemTwo = listItems[toIndex];

  const temp = itemOne.innerHTML;
  itemOne.innerHTML = itemTwo.innerHTML;
  itemTwo.innerHTML = temp;

  itemOne.classList.remove("wrong");
  itemOne.classList.remove("right");

  itemTwo.classList.remove("wrong");
  itemTwo.classList.remove("right");

  //if(checkedOnce == true) checkOrder();
}
//let checkedOnce = false;
function checkOrder() {
  //checkedOnce = true;
  let rights = 0;
  if (checks >= 1) {
    listItems.forEach((listItem, index) => {
      const letter = listItem.innerText;

      if (letter == word[index]) {
        listItem.classList.remove("wrong");
        listItem.classList.add("right");
      } else {
        listItem.classList.add("wrong");
      }

      //console.log(listItem.classList[1]);
      if (listItem.classList[1] == "right") {
        rights++;

        if (rights == word.length) {
          win();
        }
      }
    });
    checks -= 1;
    check.innerText = `Checks: ${checks}`;
    if (checks == 0 && rights != word.length) {
      lose();
    }
  }
}

function showHint() {
  if (hints >= 1) {
    hintEl_s.innerText = "";
    hintEl_p.innerText = "The word starts with: ";
    listItems.some((listItem, index) => {
      if (listItem.innerText == word[index]) {
        hintEl_s.innerText += word[index];
      } else {
        hintEl_s.innerText += word[index];
        return true;
      }
    });

    hints -= 1;
    hint.innerText = `Hints: ${hints}`;
    if (hints == 0) {
      console.log("No more hints");
    }
  }
}

function win() {
  winEl.innerHTML = "Congratulations!";
}

function lose() {
  winEl.innerText = "I'm sorry, you lost!";
}

function addEventListeners() {
  const draggables = document.querySelectorAll(".draggable");
  const dragListItems = document.querySelectorAll(".draggable-list li");
  const dragListP = document.querySelectorAll(".draggable-list li p");

  draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", dragStart);
  });

  dragListItems.forEach(item => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });

  dragListP.forEach(item => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });
}

check.addEventListener("click", checkOrder);
hint.addEventListener("click", showHint);
