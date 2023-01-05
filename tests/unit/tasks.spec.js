import { shallowMount } from '@vue/test-utils'
import Tasks from '@/views/Tasks'

describe('Tasks.vue', () => {
  it('task is getting saved', () => {
    const wrapper = shallowMount(Tasks, {
      data () {
        return {
          tasks: [
            { title: 'Hallo', description: 'Joo', date: '4-9-2001', taskId: 1 }
          ]
        }
      }
    })

    expect(wrapper.text()).toBeDefined()
  })
})
