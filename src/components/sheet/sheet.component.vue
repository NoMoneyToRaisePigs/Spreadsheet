<template>
  <div class="v-sheet-vessel" v-on-resize="onResize">

    <div class="v-sheet" @scroll="onScroll($event)" @keydown="onKeyDown($event)" @contextmenu.prevent="onMenu" tabindex="0" ref="SheetEl">
        <grid :virtual-list="virtualList" :grid-top="gridTop"></grid>    
        <selection-area :selections="selections"></selection-area>
        <div class="vault" :style="{ height: source.length * rowHeight + 'px' }"></div>
    </div>

  </div>
</template>

<script>
  
    import Grid from './grid.component.vue';
    import SelectionArea from './selection-area.component.vue';

    export default {
        components:{
            grid: Grid,
            selectionArea: SelectionArea
        },
        mounted: function(){
            let that = this;
            let vSheet = that.$el.querySelector('.v-sheet');
            this.sheetEl = vSheet;
            this.sheetHeight = this.$el.clientHeight;
            this.rowCount = this.source.length;
            this.colCount = Object.keys(this.source[0]).length;          
            this.gridRect = this.$el.querySelector('.v-sheet').getBoundingClientRect();
             
            function dragSelect(elmnt) {
                var rowIndex = null;
                var columnIndex = null;
                
                elmnt.onmousedown = startDrag;
                
                function startDrag(e) {
                
                    if(e.which == 3) return;
                    
                    let dataSet = e.target.dataset;
                    if(dataSet.row == 'undefined' || dataSet.col == 'undefined') console.error('which cell is it???');

                    rowIndex = Number(dataSet.row);
                    columnIndex = Number(dataSet.col);
                    console.log('mouse down', rowIndex, columnIndex);                   

                    if (e.which == 1) {
                        if(e.shiftKey){
                            e.preventDefault();
                            that.selections[that.currentSelectionIndex].end.row = rowIndex;
                            that.selections[that.currentSelectionIndex].end.col = columnIndex;
                        }
                        else{
                            if(e.ctrlKey){
                                that.currentSelectionIndex++;
                                that.selections = that.selections.concat([{start:{row: 0, col: 0}, end:{row: 0, col: 0}}]);
                            }
                            else{
                                that.selections.splice(1);
                                that.currentSelectionIndex = 0;
                            }

                            that.selections[that.currentSelectionIndex].start.row = rowIndex;
                            that.selections[that.currentSelectionIndex].start.col = columnIndex;
                            that.selections[that.currentSelectionIndex].end.row = rowIndex;
                            that.selections[that.currentSelectionIndex].end.col = columnIndex;
                        }
                                
                        document.onmousemove = dragging;
                    }
                    
                    document.onmouseup = endDrag;     
                }

                function dragging(e) {
                    
                    e.preventDefault();

                    that.currentEqurant = Portal.Utils.getMouseEqurant(e.pageX, e.pageY, that.gridRect);       
                    console.log('--------------equrant',  that.currentEqurant);
                    if(that.currentEqurant == 5){
                        console.log('cancel ----------------- interval');
                        that.inDragScrolling = false;
                        clearInterval(that.onDragScroll);
                        that.onDragScroll = null;

                        let dataSet = e.target.dataset;

                        if(dataSet.row && dataSet.col && (rowIndex != dataSet.row || columnIndex != dataSet.col)){
                            console.log('mouse moveing', e.target);
                                                   
                            rowIndex = Number(dataSet.row);
                            columnIndex = Number(dataSet.col);

                            if(that.selections[that.currentSelectionIndex] && that.selections[that.currentSelectionIndex].end){ //this needs to be considered.
                                that.selections[that.currentSelectionIndex].end.col = columnIndex;
                                that.selections[that.currentSelectionIndex].end.row = rowIndex;
                            }                               
                        }
                    }
                    else{
                        that.inDragScrolling = true;                   
                        that.onDragScroll = that.onDragScroll || setInterval(function(){      
                            console.log('setTimeInterval triggered');                       
                                switch(that.currentEqurant) {
                                    case 1:
                                        that.expandSelection(-1, -1);
                                        break;
                                    case 2:
                                        that.expandSelection(-1, 0);
                                        break;
                                    case 3:
                                        that.expandSelection(-1, 1);
                                        break;
                                    case 4:
                                        that.expandSelection(0, -1); 
                                        break;
                                    case 6:
                                        that.expandSelection(0, 1);
                                        break;
                                    case 7:
                                        that.expandSelection(1, -1);
                                        break;
                                    case 8:
                                        that.expandSelection(1, 0);
                                        break;
                                    case 9:
                                        that.expandSelection(1, 1); 
                                        break;
                                    default:
                                        console.error('equrant not found...');
                                        break;
                                }
                        }, that.scrollSpeed);                                                                                                            
                    }                   
                }

                function endDrag(e) {
                    console.log('cancel ----------------- interval');
                    that.inDragScrolling = false;
                    clearInterval(that.onDragScroll);
                    that.onDragScroll = null;
                    document.onmouseup = null;
                    document.onmousemove = null;
                }       
            }

            dragSelect(vSheet);
        },
        props:{
            source: {type: Array, required: true }, 
            rowHeight: {type: Number, required: false, default: 20 },
            columnWidth: {type: Number, required: false, default: 90 }
        },
        data:function(){
            return{
                //source data
                indexedSource: this.source.map((x,y) => Object.assign(x, {rowIndex: y })),
                matrix: this.source.map(x => Object.keys(x).map(y => x[y])),

                //sheet meta
                sheetEl: null,
                sheetHeight: 0,
                gridRect: null,
                colCount: 0,
                rowCount: 0,

                //virtual scroll
                lastVirtualPosition: 0,
                virtualBuffer: 5, 
                     
                //drag scroll
                currentOverCell: {row: null, col: null},
                inDragScrolling: false,
                onDragScroll: null,
                scrollSpeed: 20,
                currentEqurant: 0,

                //cell selections
                selections:[{start:{row: 0, col: 0}, end:{row: 0, col: 0}}],
                selectionMatrix: null,
                currentSelectionIndex: 0
            }   
        },
        computed:{         
            virtualList: function(){ //depends on lastVirtualPostion, sheetHeight, rowHeight, virtualBuffer.
                if(!this.sheetHeight) return[];
                let visibleRowCount = Math.ceil(this.sheetHeight / this.rowHeight);
                let scrolledRowCount = Math.floor(this.lastVirtualPosition / this.rowHeight);          
                let startIndex = scrolledRowCount  - this.virtualBuffer < 0 ? 0 : scrolledRowCount  - this.virtualBuffer;   
                let endIndex = startIndex + visibleRowCount + this.virtualBuffer * 2;                      
                let result = this.indexedSource.slice(startIndex, endIndex);

                console.log('virtual list',result);
                return result;
            },
            gridTop: function(){ //depends on lastVirtualPostion
                let _gridTop = (this.lastVirtualPosition - this.virtualBuffer * this.rowHeight) < 0 ? 0 : (this.lastVirtualPosition - this.virtualBuffer * this.rowHeight);
                _gridTop = _gridTop - (_gridTop % this.rowHeight); 
                return _gridTop;
            }  
        },

        watch:{
           
        },
        methods:{
           onScroll: function(e){
              if(this.inDragScrolling) return;
              if(Math.abs(e.target.scrollTop -  this.lastVirtualPosition) > this.virtualBuffer * this.rowHeight){
                    console.debug('virtual list re-render', e.target.scrollTop);
                    this.lastVirtualPosition = e.target.scrollTop;              
                }
           },
           onResize: function(){
               console.log('on resize');
               this.sheetHeight = this.$el.clientHeight;
               this.gridRect = this.$el.querySelector('.v-sheet').getBoundingClientRect();
           },     
           copyCurrentSelection(){
                let timerBefore = performance.now();

                let tlX = Math.min(Number(this.selections[this.currentSelectionIndex].start.col), Number(this.selections[this.currentSelectionIndex].end.col));
                let tlY = Math.min(Number(this.selections[this.currentSelectionIndex].start.row), Number(this.selections[this.currentSelectionIndex].end.row));
                let brX = Math.max(Number(this.selections[this.currentSelectionIndex].start.col), Number(this.selections[this.currentSelectionIndex].end.col));
                let brY = Math.max(Number(this.selections[this.currentSelectionIndex].start.row), Number(this.selections[this.currentSelectionIndex].end.row));

                let twoD = this.matrix.slice(tlY, brY + 1);
                twoD = twoD.map(x => x.slice(tlX, brX + 1));
                this.selectionMatrix = twoD;
                let content = this.buildString(twoD);
                Portal.Utils.copyToClipboard(content);

                let timerAfter = performance.now();
                console.info(`copy used ${Math.ceil(timerAfter - timerBefore)} milliseconds`);
           },   
           expandSelection: function(rowIncrement, colIncrement, scroll = true, where = 'end'){              
                this.selections[this.currentSelectionIndex][where].row = this.selections[this.currentSelectionIndex][where].row + rowIncrement;
                this.selections[this.currentSelectionIndex][where].col = this.selections[this.currentSelectionIndex][where].col + colIncrement;
                if(scroll) this.lastVirtualPosition = this.lastVirtualPosition + rowIncrement * this.rowHeight;                                                           
                
                if(this.selections[this.currentSelectionIndex][where].row < 0) {
                    this.selections[this.currentSelectionIndex][where].row++;
                    this.lastVirtualPosition = this.lastVirtualPosition + this.rowHeight; 
                }
                if(this.selections[this.currentSelectionIndex][where].row > this.rowCount - 1){
                    this.selections[this.currentSelectionIndex][where].row--;
                    this.lastVirtualPosition = this.lastVirtualPosition - this.rowHeight; 
                } 
                if(this.selections[this.currentSelectionIndex][where].col < 0) {
                    this.selections[this.currentSelectionIndex][where].col++;
                }
                if(this.selections[this.currentSelectionIndex][where].col > this.colCount - 1){
                    this.selections[this.currentSelectionIndex][where].col--;
                } 

                if(scroll) this.sheetEl.scrollBy(colIncrement * this.columnWidth, rowIncrement * this.rowHeight);
           },
           buildString: function(twoDArray, withStyle){
               const tab = '\t';
               const lb = '\n';

               if(withStyle)
                    return '';//build up <table> with style getting from css variables. 
               else
                    return twoDArray.reduce((a,b) => `${a}${b.reduce((c,d) =>`${c}${tab}${d}`)}${lb}`,'');
           },
           onMenu: function(event){
               // put menu here if needed.
           },
           onKeyDown: function(event){
                if (event.ctrlKey  &&  event.key === "c") { 
                    this.copyCurrentSelection(); 
                }

                if (event.ctrlKey  &&  event.key === "a") { 
                    event.preventDefault();
                    this.currentSelectionIndex = 0;
                    this.selections.splice(1);
                    this.selections[0].start.row = 0;
                    this.selections[0].start.col = 0;
                    this.selections[0].end.row = this.rowCount - 1;
                    this.selections[0].end.col = this.colCount - 1;
                }

                if (event.key.startsWith('Arrow')) {
                    event.preventDefault();
                    let rowIncrement = 0;
                    let colIncrement = 0;
                    let scroll = false;             
                    //let startCell = this.selections[this.currentSelectionIndex].start;
                    let endCell = this.selections[this.currentSelectionIndex].end;
                    let cellRect = null;

                    if(event.key == 'ArrowUp'){
                        rowIncrement = -1;
                        let cellEL = this.sheetEl.querySelector(`[data-row="${endCell.row + rowIncrement}"][data-col="${endCell.col + colIncrement}"]`);
                        cellRect = cellEL && cellEL.getBoundingClientRect();
                        scroll = cellRect && this.gridRect.top > cellRect.top;
                    } 
                    else if(event.key == 'ArrowDown'){
                        rowIncrement = 1;
                        let cellEL = this.sheetEl.querySelector(`[data-row="${endCell.row + rowIncrement}"][data-col="${endCell.col + colIncrement}"]`);
                        cellRect = cellEL && cellEL.getBoundingClientRect();
                        scroll = cellRect && this.gridRect.top + this.gridRect.height < cellRect.top + cellRect.height;
                    } 
                    else if(event.key == 'ArrowLeft'){
                        colIncrement = -1;
                        let cellEL = this.sheetEl.querySelector(`[data-row="${endCell.row + rowIncrement}"][data-col="${endCell.col + colIncrement}"]`);
                        cellRect = cellEL && cellEL.getBoundingClientRect();
                        scroll = cellRect && this.gridRect.left > cellRect.left;
                    } 
                    else if(event.key == 'ArrowRight'){
                        colIncrement = 1;
                        let cellEL = this.sheetEl.querySelector(`[data-row="${endCell.row + rowIncrement}"][data-col="${endCell.col + colIncrement}"]`);
                        cellRect = cellEL && cellEL.getBoundingClientRect();
                        scroll = cellRect && this.gridRect.left + this.gridRect.width < cellRect.left + cellRect.width;
                    } 
                    else{
                        throw 'key not found...'; 
                    }

                    if(event.shiftKey){
                        if(cellRect) this.expandSelection(rowIncrement, colIncrement, scroll);
                    }
                    else{
                        if(cellRect){
                            this.expandSelection(rowIncrement, colIncrement, scroll, 'end');
                            let startCell = this.selections[this.currentSelectionIndex].start;
                            // endCell.row = startCell.row; //this is to increment start
                            // endCell.col = startCell.col; // should I increment start or end ?
                            startCell.row = endCell.row;
                            startCell.col = endCell.col;
                            //if not in view scroll to.
                        } 
                    }
                }
           }     
        }
    };
</script>

<style lang="less">
    .v-sheet-vessel{
        height: 100%;
        width: 100%;
        box-sizing: border-box;

        *{
            box-sizing: border-box;
        }
        
        .v-sheet{        
            --sheet-font-color: black;
            --sheet-font-size: 12px;
            --sheet-background-color: transparent;
            --vault-height: 0px;

            position: relative;
            height: 100%;
            width: 100%;
            // max-height: 100%;       
            // max-width: 100%;
            overflow: auto;
            outline: none;
            
            font-size: var(--sheet-font-size);
            background-color: var(--sheet-background-color);
            color: var(--sheet-font-color);
                      
            .vault{
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: var(--vault-height);            
            }       
        }
    }
</style>
