import 'package:portfolio/src/features/technologies/domain/admin_technology_repository.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'admin_update_technology_controller.g.dart';

@riverpod
class AdminUpdateTechnologyController
    extends _$AdminUpdateTechnologyController {
  @override
  Future<void> build() async {
    // nothing to do here
  }

  Future<void> updateTechnology(Technology technology) async {
    state = const AsyncValue.loading();

    final repository = ref.read(adminTechnologyRepositoryProvider);
    state = await AsyncValue.guard(
      () => repository.updateTechnology(technology),
    );
  }
}
