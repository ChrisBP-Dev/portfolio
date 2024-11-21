import 'package:portfolio/src/features/projects/domain/admin_projects_repository.dart';
import 'package:portfolio/src/features/projects/domain/project.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'admin_update_project_controller.g.dart';

@riverpod
class AdminUpdateProjectController extends _$AdminUpdateProjectController {
  @override
  Future<void> build() async {
    // nothing to do here
  }

  Future<void> updateProject(Project project) async {
    state = const AsyncValue.loading();

    final repository = ref.read(adminProjectsRepositoryProvider);
    state = await AsyncValue.guard(
      () => repository.updateProject(project),
    );
  }
}
