package com.issueflow;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "${app.cors.origins}")

public class TaskController {

    private final TaskRepository repository;
    private final AuthService auth;

    public TaskController(TaskRepository repository, AuthService auth) {
        this.repository = repository;
        this.auth = auth;
    }

    @GetMapping
    public List<Task> getAll(@RequestHeader(value = "Authorization", required = false) String header) {
        User user = auth.require(header);
        return repository.findByOwnerId(user.getId());
    }

    @PostMapping
    public Task create(@RequestHeader(value = "Authorization", required = false) String header,
                       @RequestBody Task task) {
        User user = auth.require(header);
        task.setId(null);
        task.setOwnerId(user.getId());
        if (task.getPriority() == null) task.setPriority("MEDIUM");
        if (task.getLabels() == null) task.setLabels("");
        if (task.getAssignee() == null) task.setAssignee("");
        return repository.save(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@RequestHeader(value = "Authorization", required = false) String header,
                                       @PathVariable Long id,
                                       @RequestBody Task updated) {
        User user = auth.require(header);
        Task task = repository.findById(id).orElse(null);
        if (task == null || !user.getId().equals(task.getOwnerId())) {
            return ResponseEntity.notFound().build();
        }
        task.setTitle(updated.getTitle());
        task.setDescription(updated.getDescription());
        task.setStatus(updated.getStatus());
        task.setPriority(updated.getPriority() == null ? "MEDIUM" : updated.getPriority());
        task.setLabels(updated.getLabels() == null ? "" : updated.getLabels());
        task.setAssignee(updated.getAssignee() == null ? "" : updated.getAssignee());
        task.setDueDate(updated.getDueDate());
        return ResponseEntity.ok(repository.save(task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@RequestHeader(value = "Authorization", required = false) String header,
                                       @PathVariable Long id) {
        User user = auth.require(header);
        Task task = repository.findById(id).orElse(null);
        if (task == null || !user.getId().equals(task.getOwnerId())) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}