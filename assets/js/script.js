(()=>{

    // 배열로 수정
    const todoList = document.querySelector('.list');
    const addBtn = document.querySelector('.add_btn');
    const addInput = document.querySelector('.add_input');
    const themeBtn = document.querySelector('.theme_custom_btn');
    const themeInput = document.getElementById('theme_custom_input');
    const stateBtn = document.querySelectorAll('.state_btn');
    let list = [];
    
    const theme = {
        fnInit: function() {
            document.documentElement.style.setProperty('--primary-color', localStorage.getItem('theme'));
            themeInput.value = localStorage.getItem('theme');
        },
        fnSetting: function() {
            let value = this.value;
            document.documentElement.style.setProperty('--primary-color', value);
            localStorage.setItem('theme', value);
        },
        fnInputShowHide: function(){
            let displayOpt;
            displayOpt = (themeInput.style.display == 'block') ? 'none' : 'block';
            themeInput.style.display = displayOpt;
        },
    }
    
    const todo = {
        fnCreate: function(item) { // 생성
            const li = document.createElement('li');
            let check = '';
    
            if(item.check) {
                check = 'checked';
                li.classList.add('complete');
            }
    
            const temp = `<div class="view_item">
                                <div class="check_item">
                                    <input type="checkbox" name="" id="todo${item.id}" ${check}>
                                    <label for="todo${item.id}">
                                        <span class="check_ico">
                                            <i class="fa-solid fa-check"></i>
                                        </span>
                                        <span class="txt">${item.txt}</span>
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
                                <button type="button" class="move_btn" title="이동">
                                    <i class="fa-solid fa-bars"></i>
                                </button>
                            </div>`;
            li.innerHTML = temp;
    
            todoList.append(li);

        },
        fnAdd: function() { // 추가
            const txt = addInput.value;

            if(!(txt.length > 0)) return;

            const id = +localStorage.getItem('count');
            const check = false;
            const order = id;
            const listItem = {id, txt, check, order};

            if(localStorage.getItem('list')) {
                list = JSON.parse(localStorage.getItem('list'));
            }

            list.push(listItem);
            this.fnCreate(listItem);

            localStorage.setItem('count', JSON.stringify(id + 1));
            localStorage.setItem('list', JSON.stringify(list));

            addInput.value = '';
        },
        fnDel: function(target){ // 삭제
            if(!confirm('삭제 하시겠습니까?')) return;
            list = JSON.parse(localStorage.getItem('list'));

            const targetId = target.querySelector('input[type="checkbox"]').id.split('todo')[1];
            list = list.filter(ele => !(ele.id == targetId));

            target.remove();
            localStorage.setItem('list', JSON.stringify(list));

        },
        fnCheckChange: function(target){ // 완료
            list = JSON.parse(localStorage.getItem('list'));
            const checkItemId = target.id.split('todo')[1];
            const changeItem = list.findIndex(ele => ele.id == checkItemId);

            if(target.checked) {
                target.closest('li').classList.add('complete');
            } else {
                target.closest('li').classList.remove('complete');
            }
            list[changeItem].check = target.checked;
            
            localStorage.setItem('list', JSON.stringify(list));

            // update
            this.fnState();
        },
        fnModify: function(target){ // 수정
            list = JSON.parse(localStorage.getItem('list'));
            const Modify = target.querySelector('.type_modify');
            const ModifyTxt = Modify.querySelector('.modify_input');
            const viewItem = target.querySelector('.view_item');
            const viewItemTxt = viewItem.querySelector('.txt');
            const checkItemId = target.querySelector('input[type="checkbox"]').id.split('todo')[1];
            const changeItem = list.findIndex(ele => ele.id == checkItemId);

            viewItemTxt.innerText = ModifyTxt.value;
            list[changeItem].txt = ModifyTxt.value;
            localStorage.setItem('list', JSON.stringify(list));

            Modify.remove();
            viewItem.style.display = 'flex';

        },
        fnModifyOpen: function(target){ //수정 폼 열기
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
        },
        fnModifyCancel: function(target) { // 수정 취소
            const viewItem = target.querySelector('.view_item');
            const Modify = target.querySelector('.type_modify');
    
            Modify.remove();
            viewItem.style.display = 'flex';

        },
        fnState: function(state) { // 상태별 분류
            let checkState;
            let stateList;
            state = (state === undefined) ? document.querySelector('.state_btn.on').dataset.state : state;
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
            todoList.innerHTML = '';
            
            list = JSON.parse(localStorage.getItem('list'));

            stateList = (checkState === undefined) ? list : list.filter(ele => ele.check === checkState);

            stateList.forEach(ele => {
                this.fnCreate(ele);
            })

        },
    }

    function init() {
        // 테마 설정 적용
        if(localStorage.getItem('theme')) theme.fnInit();

        // count 값 없으면, 초기화
        !localStorage.getItem('count') && localStorage.setItem('count', 0);

        // list 값 있으면, localStorage에서 불러오기
        if(localStorage.getItem('list')) {
            list = JSON.parse(localStorage.getItem('list'));
            list.forEach(ele => {
                todo.fnCreate(ele);
            })
        }
        
    }

    init();

    // 추가버튼 클릭시
    addBtn.addEventListener('click', todo.fnAdd.bind(todo));
    // 추가input 엔터시
    addInput.addEventListener('keydown', (e) => {
        if(e.key == 'Enter') todo.fnAdd();
    })

    // 생성된 요소에 대한 change 이벤트
    document.addEventListener('change', function({target}){
        if(target.getAttribute('type') === 'checkbox') {
            todo.fnCheckChange(target);
        }
    })

    // 생성된 요소에 대한 click 이벤트
    document.addEventListener('click', function({target}){
        let targetItem = target.closest('li');

        // 삭제
        if(target.closest('.del_btn')) {
            todo.fnDel(targetItem);
        }

        // 수정폼 열기
        if(target.closest('.modify_btn')) {
            todo.fnModifyOpen(targetItem);
        }

        // 수정
        if(target.closest('.finish_btn')) {
            todo.fnModify(targetItem);
        }

        // 수정 취소
        if(target.closest('.cancel_btn')) {
            todo.fnModifyCancel(targetItem);
        }

    })

    function itemMove() {
        let targetItem, cloneItem, moveBtnWidth, originIdx, changeIdx;

        function mouseMove(e) {
            let top = e.clientY - targetItem.offsetHeight / 2;
            let left = e.clientX - targetItem.offsetWidth + moveBtnWidth;
            
            // 커서 위치에 따라 복사한 요소 이동
            cloneItem.style.top = top + 'px';
            cloneItem.style.left = left + 'px';

            // 각 리스트 아이템의 중간 위치값 저장
            const LI = document.querySelectorAll('.list li');
            const liOffset = [];
            for(let i = 0; i < LI.length; i++) {
                // 클론 클래스값을 가진 li를 제외한 위치값 저장
                if(!(LI[i].classList.contains('clone'))) {
                    liOffset.push(LI[i].getBoundingClientRect().top + (LI[i].getBoundingClientRect().height / 2));
                }
            }
            
            // 현재 커서의 위치보다 아래에 있는 요소의 첫번째 인덱스값 추출
            let targetIdx = liOffset.findIndex(ele => e.clientY <= ele);
            if(targetIdx >= 0) {
                todoList.insertBefore(targetItem, LI[targetIdx]);
            } else { // 인덱스값이 -1이면(찾지 못하면) 제일 뒤에 이동해주기.
                todoList.appendChild(targetItem);
            }

        }

        function mouseDown(e) {
            const target = e.target;
            if(target.closest('.move_btn')) {
                targetItem = e.target.closest('li');
                cloneItem = targetItem.cloneNode(true);  //요소 복사
                moveBtnWidth = e.target.closest('.move_btn').offsetWidth;

                // 클래스 및 복사 요소 추가
                targetItem.classList.add('blank');
                todoList.append(cloneItem);
                cloneItem.classList.add('clone');
    
                // 복사한 요소 스타일 지정
                cloneItem.style.position = 'fixed';
                cloneItem.style.top = (e.clientY - targetItem.offsetHeight / 2) + 'px';
                cloneItem.style.left = (e.clientX - targetItem.offsetWidth + moveBtnWidth) + 'px';
                cloneItem.style.width = targetItem.offsetWidth + 'px';

                console.log(targetItem);
                document.querySelectorAll('.list li').forEach((ele, idx) => {
                    if(ele === targetItem) {
                        console.log('current : ' + idx);
                        originIdx = idx;
                    }
                })

                // 선택한 요소의 order 값 추출
                // list.forEach(ele => {
                //     if(ele.id == targetItem.querySelector('input[type="checkbox"]').id.split('todo')[1]) {
                //         originIdx = ele.order;
                //     }
                // })
                
                // mouse move 이벤트 실행
                document.addEventListener('mousemove', mouseMove);
            }
        }

        function mouseUp(e) {

            if(cloneItem) {
                targetItem.classList.remove('blank');
                cloneItem.remove();

                const LI = document.querySelectorAll('.list li');
                LI.forEach((ele, idx) => {
                    if(ele == targetItem) {
                        console.log('change : ' + idx);
                        changeIdx = idx;
                    }
                })

                // move를 이렇게 수정을 하면 될거 같음.
                console.log(list)
                const targetIdx = list.findIndex(ele => ele === list[originIdx]);
                const filterArr = list.filter(ele => ele !== list[targetIdx]);
                const filteritem = list.slice(targetIdx, targetIdx + 1);
                filterArr.splice(changeIdx, 0, ...filteritem);
                list = filterArr;
                console.log(filteritem);

                // // localStorage 저장
                // list[originIdx].order = changeIdx;
                // let orderStep = originIdx - changeIdx;
                // if(orderStep >= 0) {

                //     for(let i = changeIdx; i < originIdx; i++) {
                //         list[i].order = i + 1;
                //     }
                // } else {
                //     forStart = changeIdx;
                //     forEnd = originIdx;
                    
                //     for(let i = forStart; i > forEnd; i--) {
                //         list[i].order = i - 1;
                //     }
                // }

                // // order 순으로 정렬
                // const dupleList = [];
                // for(let i = 0; i < list.length; i++) {
                //     let filterItem = list.filter(ele => ele.order == i);
                //     dupleList.push(...filterItem);
                // }
                // list = dupleList;

                // order 순으로 다시 저장
                localStorage.setItem('list', JSON.stringify(list));

                
                // 요소 초기화
                targetItem = undefined;
                cloneItem = undefined;


                // 순서 확인을 위한 인덱스값 초기화
                originIdx = undefined;
                changeIdx = undefined;

            }
    
            // mouse move 이벤트 삭제
            document.removeEventListener('mousemove', mouseMove);
        }

        document.addEventListener('mousedown', mouseDown);
        document.addEventListener('mouseup', mouseUp)

    }
    // itemMove();

    // 상태별 분류
    document.querySelector('.state_row').addEventListener('click', function({target}){
        let targetItem = target.closest('.state_btn');
        if(targetItem) {
            stateBtn.forEach(ele => {
                ele.classList.remove('on');
            })
            targetItem.classList.add('on');
            todo.fnState(targetItem.dataset.state);
        }
    })

    // 테마 설정 열고/닫기
    themeBtn.addEventListener('click', theme.fnInputShowHide);
    themeInput.addEventListener('blur', theme.fnInputShowHide);
    // 테마 설정
    themeInput.addEventListener('input', theme.fnSetting);

})()