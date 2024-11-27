import 'package:portfolio/src/features/auth/domain/auth_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'auth_controller.g.dart';

@riverpod
class AuthController extends _$AuthController {
  @override
  Future<void> build() async {
    // nothing to do here
  }

  Future<void> signInWithEmailAndPassword(String email, String password) async {
    state = const AsyncValue.loading();
    final repository = ref.read(authRepositoryProvider);
    state = await AsyncValue.guard(
      () => repository.signInWithEmailAndPassword(email, password),
    );
  }

  Future<void> signOut() async {
    state = const AsyncValue.loading();
    final repository = ref.read(authRepositoryProvider);
    state = await AsyncValue.guard(
      repository.signOut,
    );
  }
}
