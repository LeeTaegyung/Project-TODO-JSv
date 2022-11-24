(()=>{
    console.log('to do list!');
    const addBtn = document.querySelector('.add_btn');
    addBtn.addEventListener('click', todoAdd);

    document.addEventListener('click', (e) => {

        const target = e.target;
        const Li = target.closest('li');

        // 완료 하기
        todoComplete(Li);

        // 삭제버튼
        if(target.parentElement.classList.contains('del_btn')) {
            todoDel(Li);
        }

        // 수정폼 열기 버튼
        if(target.parentElement.classList.contains('modify_btn')) {
            todoModifyOpen(Li);
        }

        // 수정버튼
        if(target.classList.contains('finish_btn')) {
            todoModify(Li);
        }

        // 수정취소버튼
        if(target.classList.contains('cancel_btn')) {
            todoModifyCancel(Li);
        }

    })


    // 추가하기
    function todoAdd() {
        const addInput = document.querySelector('.add_input');
        const list = document.querySelector('.list');
        const listLi = document.querySelectorAll('.list li');
        const li = document.createElement('li');

        const temp = `<div class="view_item">
                            <div class="cont">
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
                            </div>
                        </div>`;
        li.innerHTML = temp;

        list.append(li);

        addInput.value = '';

    }
    
    // 삭제하기
    function todoDel(target) {
        if(confirm('정말로 삭제하시겠습니까?')) {
            target.remove();
        }
    }

    // 완료하기
    function todoComplete(target) {
        if(target) {
            if(target.querySelector('input[type="checkbox"]').checked) {
                target.classList.add('complete');
            } else {
                target.classList.remove('complete');
            }
        }
    }
    
    // 수정 하기
    function todoModify(target) {
        const viewItem = target.querySelector('.view_item');
        const viewItemTxt = viewItem.querySelector('.txt');
        const Modify = target.querySelector('.type_modify');

        Modify.remove();
        viewItem.style.display = 'flex';
        viewItemTxt.innerText = Modify.querySelector('.modify_input').value;

    }

    // 수정폼 오픈
    function todoModifyOpen(target) {
        const viewItem = target.querySelector('.view_item');
        const viewItemTxt = viewItem.querySelector('.txt');
        const inputItem = document.createElement('div');
        const temp = `<input type="text" name="" id="" class="modify_input" value="${viewItemTxt.innerHTML}">
                        <button type="button" class="finish_btn btn bg_black">수정</button>
                        <button type="button" class="cancel_btn btn line_black">취소</button>`;
        inputItem.classList.add('input_item');
        inputItem.classList.add('type_modify');
        inputItem.innerHTML = temp;

        viewItem.style.display = 'none';
        target.append(inputItem);

    }

    // 수정폼 취소 버튼
    function todoModifyCancel(target) {
        const viewItem = target.querySelector('.view_item');
        const Modify = target.querySelector('.type_modify');

        Modify.remove();
        viewItem.style.display = 'flex';
    }




// - 할일 순서 바꾸기  :: 이건 나중에 시간되면,



})()