<template>
   <div class="v-grid" :style="{ top: gridTop + 'px'}" ref="GridEl">
        <div class="grid-row" v-for="item in virtualList" v-bind:key="item.key">
            <div class="grid-column grid-cell" v-for="(col, col_index) in Object.keys(item)" v-bind:key="col" :data-col="col_index" :data-row="item.rowIndex">
                {{item[col]}} 
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
           virtualList: {type: Array, required: false, default: [] },
           gridTop: {type: Number, required: false, default: 0}
        },
        mounted: function(){
           this.$refs.GridEl.style.setProperty('--row-height', this.$parent.rowHeight + 'px');
           this.$refs.GridEl.style.setProperty('--col-width', this.$parent.columnWidth + 'px');
        }
    };
</script>

<style lang="less">
       
        .v-grid{
            --col-width: 90px;
            --row-height: 20px;
            --grid-border-color: #cedbe6;

            position: absolute;
            left: 0;

            *{
                box-sizing: border-box;
            }

            .grid-row{
                display: flex;
                height: var(--row-height);  


                .grid-cell:last-child{
                    border-right: 0.25px solid var(--grid-border-color);
                }
            }

            .grid-row:last-child{
                .grid-cell{
                    border-bottom: 0.25px solid var(--grid-border-color);
                }
            }

            .grid-column{
                width: var(--col-width);
            }

            .grid-cell{ 
                text-align: center;
                line-height: var(--row-height);
                border-top: 0.25px solid var(--grid-border-color);
                border-left: 0.25px solid var(--grid-border-color);            
            }

            // .grid-cell[data-col="3"]{
            //     background-color: blue;
            // }

            // .grid-cell[data-row="3"]{
            //     background-color: red;
            // }
        }

   
</style>
