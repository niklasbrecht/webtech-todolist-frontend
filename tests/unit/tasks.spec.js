import { shallowMount } from '@vue/test-utils'
import Tasks from '@/views/Tasks'

describe('Tasks.vue', () => {
  it('Button is getting rendered', () => {
    const wrapper = shallowMount(Tasks)

    expect(wrapper.find('[data-test="addTask"]').exists()).toEqual(true)
  })
})

describe('Tasks.vue', () => {
  it('Tasks are empty', () => {
    const wrapper = shallowMount(Tasks)

    const tasks = wrapper.find('[items]').wrapperElement.getAttribute('items')
    expect(tasks).toHaveLength(0)
  })
})

describe('Tasks.vue', () => {
  it('Tasks was being added', () => {
    const wrapper = shallowMount(Tasks, {
      data () {
        return {
          tasks: [{ title: 'Unit', description: 'Test', date: '1-1-2001', taskId: 99 }]
        }
      }
    })

    const tasks = wrapper.find('[items]').wrapperElement.getAttribute('items')
    expect(tasks).toHaveLength(15)
  })
})
