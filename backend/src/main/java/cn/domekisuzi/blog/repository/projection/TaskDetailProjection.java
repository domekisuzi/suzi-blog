package cn.domekisuzi.blog.repository.projection;

public interface TaskDetailProjection {
    String getId();
    String getTitle();
    String getDescription();
    String getModuleName();
    Boolean getCompleted();
    String getDueDate();
    String getCreatedAt();
    String getCompletedRate();
    String getSubtasks(); // JSON array of subtasks
    Integer getCompletedInteger();
    String getPriority();
}
