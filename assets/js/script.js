(()=>{
    const addBtn = document.querySelector('.add_btn');
    const addInput = document.querySelector('.add_input');
    const themeBtn = document.querySelector('.theme_custom_btn');
    const themInput = document.getElementById('theme_custom_input');
    const stateBtn = document.querySelectorAll('.state_btn');
    addBtn.addEventListener('click', todoAdd);
    addInput.addEventListener('keydown', (e) => {
        if(e.key == 'Enter') {
            todoAdd();
        }
    })

    // 테마 설정 열고/닫기
    themeBtn.addEventListener('click', themShowHide);
    themInput.addEventListener('blur', themShowHide);

    // 테마 설정
    themInput.addEventListener('input', ({target}) => {
        let value = target.value;
        document.documentElement.style.setProperty('--primary-color', value);
        localStorage.setItem('theme', value);
    });

    init();

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

    // 상태별로 보여주기
    stateBtn.forEach(ele => {
        ele.addEventListener('click', function(){
            stateBtn.forEach(ele => {
                ele.classList.remove('on');
            })
            ele.classList.add('on');
            todoState(this.dataset.state);
        })
    })

    // 상태별 보여주기 함수
    function todoState(state) {
        const list = document.querySelector('.list');
        let checkState;
        switch(state) {
            case 'do':
                checkState = false;
                break;
            case 'done':
                checkState = true;
                break;
            case 'all':
                checkState = undefined;
                break;
        }

        // 리스트 초기화
        list.innerHTML = '';
            
        let keys = keysSort();

        for(let i = 0; i < keys.length; i++) {
            let item = JSON.parse(localStorage.getItem(keys[i]));

            if(checkState == undefined) {
                todoCreate(keys[i], item.txt, item.check);
            } else {
                if(item.check == checkState) todoCreate(keys[i], item.txt, item.check);
            }
        }

    }


    function init() {
        if(localStorage.length > 0) {
            // 테마 설정 적용
            if(localStorage.getItem('theme')) {
                document.documentElement.style.setProperty('--primary-color', localStorage.getItem('theme'));
                themInput.value = localStorage.getItem('theme');
            }
            
            let keys = keysSort();

            for(let i = 0; i < keys.length; i++) {
                let item = JSON.parse(localStorage.getItem(keys[i]));
                todoCreate(keys[i], item.txt, item.check);
            }
        } else {
            localStorage.setItem('count', 0);
        }
    }

    // 키값 정렬
    function keysSort() {
        // localStorage 키값이 제대로 정렬되지 않는 문제가 있어서 count키를 제외한 key만 따로 담아 정렬.
        let keys = [];
        for(let i = 0; i < localStorage.length; i++) {
            if(localStorage.key(i) === 'count' || localStorage.key(i) === 'theme') continue;
            keys.push(+localStorage.key(i));
        }

        // sort 
        keys.sort((a, b) => a - b);

        return keys;
    }


    function themShowHide() {
        let displayOpt;
        displayOpt = (themInput.style.display == 'block') ? 'none' : 'block';
        themInput.style.display = displayOpt;
    }

    // 스토리지 추가 / 업데이트
    function setStorage(key, txt, check) {
        const value = { txt, check };
        localStorage.setItem(key, JSON.stringify(value));
    }

    function todoCreate(key, txt, check) {
        const list = document.querySelector('.list');
        const li = document.createElement('li');

        if(check) {
            check = 'checked';
            li.classList.add('complete');
        } else {
            check = '';
        }

        const temp = `<div class="view_item">
                            <div class="check_item">
                                <input type="checkbox" name="" id="todo${key}" ${check}>
                                <label for="todo${key}">
                                    <span class="check_ico">
                                        <i class="fa-solid fa-check"></i>
                                    </span>
                                    <span class="txt">${txt}</span>
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
        
    }

    // 추가하기
    function todoAdd() {
        const txt = addInput.value;
        const key = +localStorage.getItem('count');

        // 스토리지에 있는 count를 기준으로 키값 부여.
        // 이렇게 하지 않고 length로 하게 될 경우, 기존의 키값을 덮어씌우는 일이 발생함.
        if(!(txt.length > 0)) return;

        todoCreate(key, txt, false);
        setStorage(key, txt, false);

        // count값 업데이트
        localStorage.setItem('count', key + 1);
        addInput.value = '';

    }
    
    // 삭제하기
    function todoDel(target) {
        if(confirm('정말로 삭제하시겠습니까?')) {
            let key = target.querySelector('input[type="checkbox"]').id;
            key = key.split('todo')[1];
            localStorage.removeItem(key);
            target.remove();
        }
    }

    // 완료하기
    function todoComplete(target) {
        if(target) {
            const checkItem = target.querySelector('input[type="checkbox"]');
            const key = checkItem.id.split('todo')[1];
            const txt = target.querySelector('.txt').innerText;
            if(checkItem.checked) {
                target.classList.add('complete');
            } else {
                target.classList.remove('complete');
            }
            // 변경값 업데이트
            setStorage(key, txt, checkItem.checked);
        }
    }
    
    // 수정 하기
    function todoModify(target) {
        let key = target.querySelector('input[type="checkbox"]').id;
        const viewItem = target.querySelector('.view_item');
        const viewItemTxt = viewItem.querySelector('.txt');
        const Modify = target.querySelector('.type_modify');
        key = key.split('todo')[1];

        Modify.remove();
        viewItem.style.display = 'flex';
        viewItemTxt.innerText = Modify.querySelector('.modify_input').value;
        setStorage(key, viewItemTxt.innerText, false);

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


})()