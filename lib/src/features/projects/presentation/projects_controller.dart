import 'package:portfolio/src/core/constants/projects.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:portfolio/src/features/projects/domain/projects_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'projects_controller.g.dart';

// TODO(me): Check this and remove it if not needed
@riverpod
class ProjectsController extends _$ProjectsController {
  @override
  Future<void> build() async {
    // nothing to do here
  }

  Future<void> createProjecs() async {
    for (final project in kProjects) {
      await _createProject(project);
    }
  }

  Future<void> _createProject(Project project) async {
    state = const AsyncValue.loading();
    final repository = ref.read(projectsRepositoryProvider);
    state = await AsyncValue.guard(
      () => repository.createProject(project),
    );
  }
}
