package com.vivonow.repository;

import com.vivonow.model.Task;
import com.vivonow.model.TaskStatus;
import com.vivonow.model.Team;
import com.vivonow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByTeam(Team team);
    List<Task> findByTeamAndStatus(Team team, TaskStatus status);
    List<Task> findByAssignee(User assignee);
    List<Task> findByTeamAndAssignee(Team team, User assignee);
}
