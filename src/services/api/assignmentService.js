import { getApperClient } from "@/services/apperClient"

export const assignmentService = {
  getAll: async () => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('assignment_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "grade_c"}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
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
        title: item.title_c,
        description: item.description_c,
        classId: item.class_id_c?.Id ? String(item.class_id_c.Id) : null,
        dueDate: item.due_date_c,
        priority: item.priority_c || false,
        completed: item.completed_c || false,
        completedDate: item.completed_date_c || null,
        grade: item.grade_c || null
      }))
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error)
      return []
    }
  },

  getById: async (id) => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.getRecordById('assignment_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "grade_c"}}
        ]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error("Assignment not found")
      }

      if (!response.data) {
        throw new Error("Assignment not found")
      }

      const item = response.data
      return {
        Id: item.Id,
        title: item.title_c,
        description: item.description_c,
        classId: item.class_id_c?.Id ? String(item.class_id_c.Id) : null,
        dueDate: item.due_date_c,
        priority: item.priority_c || false,
        completed: item.completed_c || false,
        completedDate: item.completed_date_c || null,
        grade: item.grade_c || null
      }
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error)
      throw new Error("Assignment not found")
    }
  },

  getByClassId: async (classId) => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.fetchRecords('assignment_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "class_id_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "grade_c"}}
        ],
        where: [{
          "FieldName": "class_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(classId)]
        }],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      })

      if (!response.success) {
        console.error(response.message)
        return []
      }

      if (!response.data || response.data.length === 0) {
        return []
      }

      return response.data.map(item => ({
        Id: item.Id,
        title: item.title_c,
        description: item.description_c,
        classId: item.class_id_c?.Id ? String(item.class_id_c.Id) : null,
        dueDate: item.due_date_c,
        priority: item.priority_c || false,
        completed: item.completed_c || false,
        completedDate: item.completed_date_c || null,
        grade: item.grade_c || null
      }))
    } catch (error) {
      console.error("Error fetching assignments by class:", error?.response?.data?.message || error)
      return []
    }
  },

  create: async (assignmentData) => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.createRecord('assignment_c', {
        records: [{
          title_c: assignmentData.title,
          description_c: assignmentData.description,
          class_id_c: assignmentData.classId ? parseInt(assignmentData.classId) : null,
          due_date_c: assignmentData.dueDate,
          priority_c: assignmentData.priority || false,
          completed_c: assignmentData.completed || false,
          completed_date_c: assignmentData.completedDate || null,
          grade_c: assignmentData.grade || null
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
          console.error(`Failed to create assignment: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to create assignment")
        }

        if (successful.length > 0) {
          const item = successful[0].data
          return {
            Id: item.Id,
            title: item.title_c,
            description: item.description_c,
            classId: item.class_id_c?.Id ? String(item.class_id_c.Id) : null,
            dueDate: item.due_date_c,
            priority: item.priority_c || false,
            completed: item.completed_c || false,
            completedDate: item.completed_date_c || null,
            grade: item.grade_c || null
          }
        }
      }

      throw new Error("Failed to create assignment")
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error)
      throw error
    }
  },

  update: async (id, assignmentData) => {
    try {
      const apperClient = getApperClient()
      const updateData = {
        Id: parseInt(id)
      }

      if (assignmentData.title !== undefined) updateData.title_c = assignmentData.title
      if (assignmentData.description !== undefined) updateData.description_c = assignmentData.description
      if (assignmentData.classId !== undefined) updateData.class_id_c = assignmentData.classId ? parseInt(assignmentData.classId) : null
      if (assignmentData.dueDate !== undefined) updateData.due_date_c = assignmentData.dueDate
      if (assignmentData.priority !== undefined) updateData.priority_c = assignmentData.priority
      if (assignmentData.completed !== undefined) updateData.completed_c = assignmentData.completed
      if (assignmentData.completedDate !== undefined) updateData.completed_date_c = assignmentData.completedDate
      if (assignmentData.grade !== undefined) updateData.grade_c = assignmentData.grade

      const response = await apperClient.updateRecord('assignment_c', {
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
          console.error(`Failed to update assignment: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to update assignment")
        }

        if (successful.length > 0) {
          const item = successful[0].data
          return {
            Id: item.Id,
            title: item.title_c,
            description: item.description_c,
            classId: item.class_id_c?.Id ? String(item.class_id_c.Id) : null,
            dueDate: item.due_date_c,
            priority: item.priority_c || false,
            completed: item.completed_c || false,
            completedDate: item.completed_date_c || null,
            grade: item.grade_c || null
          }
        }
      }

      throw new Error("Failed to update assignment")
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error)
      throw error
    }
  },

  delete: async (id) => {
    try {
      const apperClient = getApperClient()
      const response = await apperClient.deleteRecord('assignment_c', {
        RecordIds: [parseInt(id)]
      })

      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete assignment: ${JSON.stringify(failed)}`)
          throw new Error(failed[0].message || "Failed to delete assignment")
        }

        return true
      }

      return true
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error)
      throw error
    }
  }
}