import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/features/auth/data/firebase_admin_auth_repository_imp.dart';
import 'package:portfolio/src/features/auth/data/services/firebase_auth_service.dart';
import 'package:portfolio/src/features/auth/domain/admin.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'auth_repository.g.dart';

abstract class AuthRepository {
  Admin? get currentUser;
  Stream<Admin?> authStateChanges();
  Future<void> signInWithEmailAndPassword(String email, String password);
  Future<void> signOut();
}

@riverpod
AuthRepository authRepository(Ref ref) {
  return FirebaseAdminAuthRepositoryImp(
    ref.read(firebaseAuthServiceProvider),
  );
}

@Riverpod(keepAlive: true)
Stream<Admin?> authStateChanges(Ref ref) {
  return ref.watch(authRepositoryProvider).authStateChanges();
}
