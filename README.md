## random number keypad 
## 제작목적
- 하이브리드앱 구축에 필요한 결제 비밀번호 ( 내부 사정으로 인해 APP이 아닌 웹으로 제작 )
- 랜덤 키패드 라이브러리 리서칭 및 검토 후 대부분의 lib 들이 자판과 번호판이 같이 제작되어 있고 용량과 커스터마이징의 효율성을 위해 번호판만 제작하게 됨.

## circle preview HTML
```html
<!-- keypad cirlce hidden number -->
<div id="keyInsert">
    <input type="hidden" data-hidden-key>
</div>
<!-- //keypad cirlce hidden number -->
```

## Constructor 
```html
var randomKeypad = new SecurityKeypad('selector', {
    complete : function () {
        // 번호 입력 완료시
    }
});
```
| Name     | Character |
| ---      | ---       |
| randomKeypad.Hide() | 키패드 숨김 or reset     |
| randomKeypad.Reload()    | 리셋 및 재배열   |
| randomKeypad.hiddenKey    | data-hidden-key element   |
