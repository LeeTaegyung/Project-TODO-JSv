(()=>{
    console.log('to do list!');
    const addBtn = document.querySelector('.add_btn');
    addBtn.addEventListener('click', todoAdd);


    // - 할일 추가하기
    function todoAdd() {
        const addInput = document.querySelector('.add_input');
        const list = document.querySelector('.list');
        const listLi = document.querySelectorAll('.list li');
        const li = document.createElement('li');

        const temp = `<div class="cont">
                            <input type="checkbox" name="" id="todo${listLi.length}">
                            <label for="todo${listLi.length}">
                                <span class="check_ico">
                                    <i class="fa-solid fa-check"></i>
                                </span>
                                <span class="txt">${addInput.value}</span>
                            </label>
                        </div>
                        <div class="util">
                            <button type="button" class="del_btn" title="삭제">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                            <button type="button" class="modify_btn" title="수정">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                        </div>`;
        li.innerHTML = temp;

        list.append(li);

        addInput.value = '';

    }
    // - 할일 삭제하기
    function todoDel() {
        console.log('삭제~');
    }
    // - 할일 완료하기
    function todoComplete() {
        console.log('완료~');

    }
    // - 할일 수정하기
    function todoUpdate() {
        console.log('수정~');

    }




// - 할일 순서 바꾸기  :: 이건 나중에 시간되면,



})()