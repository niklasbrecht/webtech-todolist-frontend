import { shallowMount } from '@vue/test-utils'
import Navbar from '@/components/Navbar'

describe('Navbar.vue', () => {
  it('Login is getting rendered', () => {
    const wrapper = shallowMount(Navbar, {
      data () {
        return {
          loggedIn: true
        }
      }
    })

    expect(wrapper.find('[data-test="login"]').text()).toBe('Logout')
  })
})

describe('Navbar.vue', () => {
  it('Mail validation is not passing input', () => {
    const wrapper = shallowMount(Navbar)

    wrapper.setData({
      email: 'johannes.gmail.com',
      password: 'baumlebt'
    })

    expect(wrapper.vm.inputValidationMail).toBe(false)
  })
})

describe('Navbar.vue', () => {
  it('Password validation is not passing input', () => {
    const wrapper = shallowMount(Navbar)

    wrapper.setData({
      email: 'johannes@gmail.com',
      password: 'b'
    })

    expect(wrapper.vm.inputValidationPassword).toBe(false)
  })
})

describe('Navbar.vue', () => {
  it('Input validation is passing input', () => {
    const wrapper = shallowMount(Navbar)

    wrapper.setData({
      email: 'johannes@gmail.com',
      password: 'baumlebt'
    })

    expect((wrapper.vm.inputValidationMail && wrapper.vm.inputValidationPassword)).toBe(true)
  })
})
