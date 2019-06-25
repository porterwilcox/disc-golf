<template>
  <div id="app" class="container-fluid">
    <router-view/>
  </div>
</template>

<style>
:root {
  --main: #0d014d;
}
.color {
  color: var(--main)
}
.bg {
  background: var(--main)
}
.action {
  cursor: pointer;
}
.no-events {
  pointer-events: none;
}
.ts-white {
  text-shadow: 10px 2px white, -10px -2px white;
}
.w-fc {
  width: fit-content;
}
</style>
