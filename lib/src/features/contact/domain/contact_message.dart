import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:portfolio/src/core/constants/business_information.dart';
import 'package:portfolio/src/features/contact/domain/contact_phone_number.dart';
import 'package:portfolio/src/localization/l10n.dart';
part 'contact_message.freezed.dart';
part 'contact_message.g.dart';

@freezed
class ContactMessage with _$ContactMessage {
  const factory ContactMessage({
    required String name,
    required String email,
    required String message,
    required ContactPhoneNumber phoneNumber,
    @Default(SendThrough.whatsapp) SendThrough sendThrough,
  }) = _ContactMessage;

  factory ContactMessage.fromJson(Map<String, dynamic> json) =>
      _$ContactMessageFromJson(json);
}

extension ContactMessageX on ContactMessage {
  String formattedMessage(AppLocalizations l10n) {
    return l10n.messageTemplate(
      name,
      BusinessInformation.website,
      message,
      '${phoneNumber.countryCode}${phoneNumber.phoneNumber}',
      email,
    );
  }
}

enum SendThrough { email, whatsapp }
