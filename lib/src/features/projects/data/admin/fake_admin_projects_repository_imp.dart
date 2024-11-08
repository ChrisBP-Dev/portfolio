import 'dart:async';
import 'package:portfolio/src/core/constants/projects.dart';
import 'package:portfolio/src/features/projects/domain/admin_projects_repository.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';

class FakeAdminProjectsRepositoryImp implements AdminProjectsRepository {
  final List<Project> _projects = kProjects;

  @override
  Stream<List<Project>> getProjectsStream() {
    return Stream.value(_projects);
  }

  @override
  Future<Project> createProject(Project project) async {
    _projects.add(project);
    return project;
  }

  @override
  Future<Project> updateProject(Project project) async {
    final index = _projects.indexWhere((p) => p.id == project.id);
    if (index != -1) {
      _projects[index] = project;
    }
    return project;
  }

  @override
  Future<void> deleteProject(Project project) async {
    _projects.removeWhere((p) => p.id == project.id);
  }
}
