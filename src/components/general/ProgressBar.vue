<template>
    <div class="">
      <ul class="progressbar">
        <li class="active">Processing</li>
        <li>Shipped</li>
        <li>Delivered</li>
      </ul>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.container {
//   width: 100%;
}
.progressbar {
  counter-reset: step;
}
.progressbar li {
    
  list-style-type: none;
  float: left;
  width: 33.33%;
  position: relative;
  text-align: center;
  
}
.progressbar li::before {
  content: "";
  counter-increment: step;
  width: 15px;
  height: 15px;
  border: 3px solid #ddd;
  display: block;
  text-align: center;
  margin: 0 2px;
  border-radius: 50%;
  background-color: #ddd;

}
.progressbar li::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 3px;
  background-color: #ddd;
  top: 6.0px;
  left: -58%;
z-index: -0.8;

}
// .progressbar li:first-child:after {
//   content: none;
// }
.progressbar li.active{
    color: #5064CC;

}
.progressbar li.active::before{
    border-color: #5064CC;
    background-color: #5064CC;
}
.progressbar li.active + li::after{
    background-color: #5064CC;
}
// .progressbar li.active + li::before{
//     border-color: #5064CC;
//     background-color: #5064CC;
//     z-index: -1;
// }
li{
    font-size: 11px;
    color: #979797 !important;
}
</style>