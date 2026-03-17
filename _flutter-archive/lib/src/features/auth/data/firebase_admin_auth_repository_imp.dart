import 'package:portfolio/src/features/auth/data/services/firebase_auth_service.dart';
import 'package:portfolio/src/features/auth/domain/admin.dart';
import 'package:portfolio/src/features/auth/domain/auth_repository.dart';

class FirebaseAdminAuthRepositoryImp implements AuthRepository {
  const FirebaseAdminAuthRepositoryImp(this.firebaseAuthService);
  final FirebaseAuthService firebaseAuthService;

  @override
  Admin? get currentUser => firebaseAuthService.currentUser;

  @override
  Stream<Admin?> authStateChanges() => firebaseAuthService.authStateChanges();

  @override
  Future<void> signInWithEmailAndPassword(String email, String password) async {
    await firebaseAuthService.signInWithEmailAndPassword(email, password);
  }

  @override
  Future<void> signOut() async {
    await firebaseAuthService.signOut();
  }
}
