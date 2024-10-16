import 'package:flutter/material.dart';
import 'package:portfolio/src/common_widgets/wrapper_scroll.dart';
import 'package:portfolio/src/constants/app_sizes.dart';
import 'package:portfolio/src/features/contact/presentation/components/contact_description.dart';
import 'package:portfolio/src/features/contact/presentation/components/contact_form.dart';

class ContactPage extends StatelessWidget {
  const ContactPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const WrapperScroll(
      key: PageStorageKey('ContactPage'),
      components: [
        ContactDescription(),
        ContactForm(),
        gapH39,
      ],
    );
  }
}
