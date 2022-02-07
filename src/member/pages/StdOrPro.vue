<template>
  <!-- Content -->
  <!-- 배경 사이즈 -->
  <!-- choose-size에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
  <div class="choose-size">
    <!-- 배경 색, 효과 / 커스텀 안함 -->
      <Particles
          id="tsparticles"
          class="w-full h-100"
          :particlesInit="particlesInit"
          :particlesLoaded="particlesLoaded"
          :options="{
                    background: {
                        color: {
                            value: '#4611a7'
                        }
                    },
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onClick: {
                                enable: true,
                                mode: 'push'
                            },
                            onHover: {
                                enable: true,
                                mode: 'repulse'
                            },
                            resize: true
                        },
                        modes: {
                            bubble: {
                                distance: 400,
                                duration: 2,
                                opacity: 0.8,
                                size: 40
                            },
                            push: {
                                quantity: 4
                            },
                            repulse: {
                                distance: 200,
                                duration: 0.4
                            }
                        }
                    },
                    particles: {
                        color: {
                            value: '#ffffff'
                        },
                        links: {
                            color: '#ffffff',
                            distance: 150,
                            enable: true,
                            opacity: 0.5,
                            width: 1
                        },
                        collisions: {
                            enable: true
                        },
                        move: {
                            direction: 'none',
                            enable: true,
                            outMode: 'bounce',
                            random: false,
                            speed: 1,
                            straight: false
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800
                            },
                            value: 80
                        },
                        opacity: {
                            value: 0.5
                        },
                        shape: {
                            type: 'circle'
                        },
                        size: {
                            random: true,
                            value: 5
                        }
                    },
                    detectRetina: true
                }"
      />
    </div>
    <!-- 로고 및 제목과 본문을 담는 div 시작 -->
    <!-- choose-flex에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
    <div class="choose-flex" style="z-index: 9999; height: 100vh; justify-content: center; align-items: center">
      <!-- content담는 최상위 div -->
      <!-- choose-content에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
      <div class="choose-content dlab-home">
        <!-- card 중 제일 상위 div , 제일 큰 card 부분임.  -->
        <!-- choose-div에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
        <div>

          <!-- padding-bottom_20px에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
          <div>
            <div class="p-b20">
              <h2 class="type-title-text font-semibold font-nanumGothicBold">회원 유형을 선택해 주세요 </h2>
            </div>
          </div>
          <!-- card-for-grid에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
          <div class="card-for-grid media-m-40">
            <!-- big-card에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
            <div class="big-card" onclick="passRole('5')">
              <!-- card에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
              <div class="card mb-4 ">
                <!-- card-body에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
                <div class="card-body not_opacity" id="pro">
                  <!-- width_360px에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
                  <img src="../../assets/images/member_pro.png"
                       alt="현재 브라우저에서는 지원하지 않는 형식입니다."
                       class="width-360 h-5/6">
                  <h4 class="font-nanumGothicBold">교수님</h4>
                </div>
              </div>
            </div>
            <!-- big-card에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
            <div class="big-card" onclick="passRole('6')">
              <!-- card에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
              <div class="card mb-4 ">
                <!-- card-body에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
                <div class="card-body" id="std">
                  <!-- width_360px에 대한 내용은 std_or_pro.css에 정의되어 있음. -->
                  <img src="../../assets/images/member_std.png"
                       alt="현재 브라우저에서는 지원하지 않는 형식입니다."
                       class="width-360 h-5/6">
                  <h4 class="font-nanumGothicBold">학생</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

<!--  </div>-->
</template>

<script>
export default {
  name: "StdOrPro.vue"
}
</script>

<style scoped>

</style>