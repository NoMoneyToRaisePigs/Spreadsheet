<template>
    <div class="selection-area-root" v-if="selections.length">
        <div class="selection-area" v-for="area in selectionAreas" v-bind:key="area.key" :style="{ top: area.top + 'px', left: area.left + 'px', height: area.height + 'px', width: area.width + 'px' }"></div>
    </div>
</template>

<script>
    export default {
        props:{
           selections: {type: Array, required: false, default: 0 }
        },
        computed:{
            selectionAreas:function(){
                let areas = [];

                this.selections.forEach((slt, index) =>{  
                    //tl: top-left,  br: bottom-left                
                    let tlX = Math.min(Number(slt.start.col), Number(slt.end.col));
                    let tlY = Math.min(Number(slt.start.row), Number(slt.end.row));
                    let brX = Math.max(Number(slt.start.col), Number(slt.end.col));
                    let brY = Math.max(Number(slt.start.row), Number(slt.end.row));

                    areas.push({
                        key: index,
                        top: tlY * this.$parent.rowHeight,
                        left: tlX * this.$parent.columnWidth,
                        height: (brY - tlY + 1) * this.$parent.rowHeight,
                        width: (brX - tlX + 1) * this.$parent.columnWidth
                    });
                });

                return areas;
            }
        }
    };
</script>

<style lang="less">
.selection-area-root{
    position: absolute;
    top: 0;
    left: 0;

    .selection-area{
        --selection-area-color: rgba(255,99,88,0.25);
        --selection-area-border: #ff6358;
        
        position: absolute;
        box-sizing: border-box;
        pointer-events: none;
        border: 2px solid var(--selection-area-border);
        background-color: var(--selection-area-color);
    }
}
  
</style>
