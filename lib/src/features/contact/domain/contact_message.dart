// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:portfolio/src/constants/business_information.dart';

class ContactMessage {
  const ContactMessage({
    required this.name,
    required this.email,
    required this.message,
    required this.phoneNumber,
    this.sendThrough = SendThrough.whatsapp,
  });
  final String name;
  final String email;
  final String message;
  final ContactPhoneNumber phoneNumber;
  final SendThrough sendThrough;

  String get formattedMessage => '''
Hi,
My name is *$name*,
I came from your website ${BusinessInformation.website}
*and I would like to find out more about:*
  
$message

you can contact me through:
*Phone Number:* ${phoneNumber.countryCode} ${phoneNumber.number}
*Email:* $email
''';

  ContactMessage copyWith({
    String? name,
    String? email,
    String? message,
    ContactPhoneNumber? phoneNumber,
    SendThrough? sendThrough,
  }) {
    return ContactMessage(
      name: name ?? this.name,
      email: email ?? this.email,
      message: message ?? this.message,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      sendThrough: sendThrough ?? this.sendThrough,
    );
  }
}

class ContactPhoneNumber {
  const ContactPhoneNumber({
    required this.countryCode,
    required this.number,
  });
  final String countryCode;
  final String number;

  ContactPhoneNumber copyWith({
    String? countryCode,
    String? number,
  }) {
    return ContactPhoneNumber(
      countryCode: countryCode ?? this.countryCode,
      number: number ?? this.number,
    );
  }
}

enum SendThrough { email, whatsapp }
