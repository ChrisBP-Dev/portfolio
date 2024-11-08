import 'package:portfolio/src/features/contact/domain/contact_message.dart';
import 'package:portfolio/src/features/contact/domain/contact_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'contact_controller.g.dart';

@riverpod
class ContactController extends _$ContactController {
  @override
  ContactMessage build() {
    return const ContactMessage(
      name: '',
      email: '',
      phoneNumber: ContactPhoneNumber(countryCode: '', number: ''),
      message: '',
    );
  }

  void updateName(String name) {
    state = state.copyWith(name: name);
  }

  void updateEmail(String email) {
    state = state.copyWith(email: email);
  }

  void updatePhoneNumber(String countryCode, String number) {
    state = state.copyWith(
      phoneNumber: ContactPhoneNumber(
        countryCode: countryCode,
        number: number,
      ),
    );
  }

  void updateMessage(String message) {
    state = state.copyWith(message: message);
  }

  void updateSendThrough(SendThrough sendThrough) {
    state = state.copyWith(sendThrough: sendThrough);
  }

// TODO(me): move to a separate file controller using AsyncValue.guard()
  Future<void> sendContactMessage() async {
    await ref.read(contactRepositoryProvider).sendContactMessage(state);
  }
}
