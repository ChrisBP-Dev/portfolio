import 'package:flutter/material.dart';
import 'package:portfolio/src/common_widgets/wrapper_scroll.dart';

class ContactPage extends StatelessWidget {
  const ContactPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const WrapperScroll(
      key: PageStorageKey('ContactPage'),
      components: [],
    );
  }
}
