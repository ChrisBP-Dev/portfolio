import 'package:portfolio/src/features/technologies/domain/admin_technology_repository.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:portfolio/src/routing/app_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:uuid/uuid.dart';
part 'admin_create_technology_controller.g.dart';

@riverpod
class AdminCreateTechnologyController
    extends _$AdminCreateTechnologyController {
  @override
  Future<void> build() async {
    // nothing to do here
  }

  Future<void> createTechnology(Technology technology) async {
    state = const AsyncValue.loading();

    final repository = ref.read(adminTechnologyRepositoryProvider);
    final id = const Uuid().v4();
    state = await AsyncValue.guard(
      () => repository.createTechnology(technology.copyWith(id: id)),
    );
    if (!state.hasError) {
      ref.read(goRouterProvider).pop();
    }
  }
}
