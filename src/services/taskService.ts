import { db, taskSchema, Task } from "@/storage/db";

/**
 * Create a new task in the specified section
 * @param section - Section identifier ("today", "this-week", "soon", "someday")
 * @param title - Task title
 * @returns Promise resolving to the created task
 */
export async function createTask(
  section: "today" | "this-week" | "soon" | "someday",
  title: string
): Promise<Task> {
  try {
    // Validate inputs
    if (!title || title.trim().length === 0) {
      throw new Error("Task title is required");
    }

    if (!["today", "this-week", "soon", "someday"].includes(section)) {
      throw new Error("Invalid section");
    }

    // Get current max order for the section
    const existingTasks = await db.tasks
      .where("section")
      .equals(section)
      .toArray();

    const maxOrder =
      existingTasks.length > 0
        ? Math.max(...existingTasks.map(t => t.order ?? -1))
        : -1;

    // Create new task object
    const newTask: Omit<Task, "id"> = {
      title: title.trim(),
      section,
      order: maxOrder + 1,
      status: "todo",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate task object with Zod schema
    const validationResult = taskSchema.safeParse(newTask);
    if (!validationResult.success) {
      throw new Error(
        `Task validation failed: ${validationResult.error.message}`
      );
    }

    // Add to database
    const id = await db.tasks.add(validationResult.data as Task);

    // Retrieve and return created task
    const createdTask = await db.tasks.get(id);
    if (!createdTask) {
      throw new Error("Failed to retrieve created task");
    }

    return createdTask;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

/**
 * Update an existing task
 * @param id - Task ID
 * @param updates - Partial task object with fields to update
 * @returns Promise resolving to the updated task
 */
export async function updateTask(
  id: number,
  updates: Partial<Task>
): Promise<Task> {
  try {
    // Validate task exists
    const existingTask = await db.tasks.get(id);
    if (!existingTask) {
      throw new Error(`Task with id ${id} not found`);
    }

    // Update updatedAt timestamp
    const updatedTask = {
      ...existingTask,
      ...updates,
      updatedAt: new Date(),
    };

    // Validate updated task object with Zod schema
    const validationResult = taskSchema.safeParse(updatedTask);
    if (!validationResult.success) {
      throw new Error(
        `Task validation failed: ${validationResult.error.message}`
      );
    }

    // Update database
    await db.tasks.update(id, validationResult.data as Task);

    // Retrieve and return updated task
    const task = await db.tasks.get(id);
    if (!task) {
      throw new Error("Failed to retrieve updated task");
    }

    return task;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

/**
 * Delete a task
 * @param id - Task ID
 * @returns Promise resolving when task is deleted
 */
export async function deleteTask(id: number): Promise<void> {
  try {
    // Validate task exists
    const existingTask = await db.tasks.get(id);
    if (!existingTask) {
      throw new Error(`Task with id ${id} not found`);
    }

    // Delete from database
    await db.tasks.delete(id);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}

/**
 * Get all tasks in a specific section, sorted by order
 * @param section - Section identifier ("today", "this-week", "soon", "someday")
 * @returns Promise resolving to array of tasks sorted by order
 */
export async function getTasksBySection(
  section: "today" | "this-week" | "soon" | "someday"
): Promise<Task[]> {
  try {
    if (!["today", "this-week", "soon", "someday"].includes(section)) {
      throw new Error("Invalid section");
    }

    // Query database for tasks matching section
    const tasks = await db.tasks
      .where("section")
      .equals(section)
      .sortBy("order");

    return tasks;
  } catch (error) {
    console.error("Error getting tasks by section:", error);
    throw error;
  }
}

/**
 * Get a task by ID
 * @param id - Task ID
 * @returns Promise resolving to the task or undefined if not found
 */
export async function getTask(id: number): Promise<Task | undefined> {
  try {
    return await db.tasks.get(id);
  } catch (error) {
    console.error("Error getting task:", error);
    throw error;
  }
}

/**
 * Get all tasks
 * @returns Promise resolving to array of all tasks
 */
export async function getAllTasks(): Promise<Task[]> {
  try {
    return await db.tasks.toArray();
  } catch (error) {
    console.error("Error getting all tasks:", error);
    throw error;
  }
}

