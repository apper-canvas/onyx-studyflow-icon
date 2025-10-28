import { getApperClient } from "@/services/apperClient"

export const classService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('class_item_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "current_grade_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      if (!response.data || response.data.length === 0) {
        return []
      }

      // Transform data to match expected format
      return response.data.map(item => ({
        Id: item.Id,
        name: item.name_c,
        code: item.code_c,
        instructor: item.instructor_c,
        location: item.location_c,
        credits: item.credits_c,
        color: item.color_c,
        schedule: item.schedule_c ? JSON.parse(item.schedule_c) : [],
        currentGrade: item.current_grade_c
      }))
    } catch (error) {
      console.error("Error fetching classes:", error?.response?.data?.message || error)
      return []
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('class_item_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "current_grade_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Class not found")
      }

      if (!response.data) {
        throw new Error("Class not found")
      }

      const item = response.data
      return {
        Id: item.Id,
        name: item.name_c,
        code: item.code_c,
        instructor: item.instructor_c,
        location: item.location_c,
        credits: item.credits_c,
        color: item.color_c,
        schedule: item.schedule_c ? JSON.parse(item.schedule_c) : [],
        currentGrade: item.current_grade_c
      }
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error?.response?.data?.message || error)
      throw new Error("Class not found")
    }
  },

  create: async (classData) => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.createRecord('class_item_c', {
        records: [{
          name_c: classData.name,
          code_c: classData.code,
          instructor_c: classData.instructor,
          location_c: classData.location,
          credits_c: classData.credits,
          color_c: classData.color,
          schedule_c: classData.schedule ? JSON.stringify(classData.schedule) : "[]",
          current_grade_c: null
        }]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create class: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to create class")
        }

        if (successful.length > 0) {
          const item = successful[0].data
          return {
            Id: item.Id,
            name: item.name_c,
            code: item.code_c,
            instructor: item.instructor_c,
            location: item.location_c,
            credits: item.credits_c,
            color: item.color_c,
            schedule: item.schedule_c ? JSON.parse(item.schedule_c) : [],
            currentGrade: item.current_grade_c
          }
        }
      }

      throw new Error("Failed to create class")
    } catch (error) {
      console.error("Error creating class:", error?.response?.data?.message || error)
      throw error
    }
  },

  update: async (id, classData) => {
    try {
      const apperClient = getApperClient()
      const updateData = {
        Id: parseInt(id)
      }

      if (classData.name !== undefined) updateData.name_c = classData.name
      if (classData.code !== undefined) updateData.code_c = classData.code
      if (classData.instructor !== undefined) updateData.instructor_c = classData.instructor
      if (classData.location !== undefined) updateData.location_c = classData.location
      if (classData.credits !== undefined) updateData.credits_c = classData.credits
      if (classData.color !== undefined) updateData.color_c = classData.color
      if (classData.schedule !== undefined) updateData.schedule_c = JSON.stringify(classData.schedule)
      if (classData.currentGrade !== undefined) updateData.current_grade_c = classData.currentGrade

      const response = await apperClient.updateRecord('class_item_c', {
        records: [updateData]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update class: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to update class")
        }

        if (successful.length > 0) {
          const item = successful[0].data
          return {
            Id: item.Id,
            name: item.name_c,
            code: item.code_c,
            instructor: item.instructor_c,
            location: item.location_c,
            credits: item.credits_c,
            color: item.color_c,
            schedule: item.schedule_c ? JSON.parse(item.schedule_c) : [],
            currentGrade: item.current_grade_c
          }
        }
      }

      throw new Error("Failed to update class")
    } catch (error) {
      console.error("Error updating class:", error?.response?.data?.message || error)
      throw error
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.deleteRecord('class_item_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete class: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to delete class")
        }

        return true
      }

      return true
    } catch (error) {
      console.error("Error deleting class:", error?.response?.data?.message || error)
      throw error
    }
  }
}